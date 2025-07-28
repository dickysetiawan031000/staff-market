<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with('user');

        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $transactions = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'filters' => $request->only(['date', 'user_id', 'status']),
            'users' => User::select('id', 'name', 'employee_id')
                ->whereHas('roles', function ($query) {
                    $query->where('name', 'staff'); // ambil user yang role-nya staff
                })
                ->whereHas('transactions')
                ->get(),
        ]);
    }


    public function create()
    {
        return Inertia::render('Transactions/Create', [
            'items' => Item::all(),
            'users' => User::role('staff')->get(), // ambil user yang role-nya staff
            'page_settings' => [
                'title' => 'Create Transaction',
                'subtitle' => 'Fill in the form below to create a new transaction.',
                'method' => 'POST',
                'action' => route('transactions.store'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'status' => ['required', 'in:paid,installment'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.item_id' => ['required', 'exists:items,id'],
            'items.*.quantity' => ['required', 'min:1'],
            'total_installment' => ['required_if:status,installment', 'nullable', 'numeric', 'min:0'],
        ]);

        DB::beginTransaction();
        try {
            $total = 0;
            foreach ($validated['items'] as $item) {
                $itemModel = Item::where('id', $item['item_id'])->lockForUpdate()->first();
                if ($itemModel->stock < $item['quantity']) {
                    throw new \Exception('Insufficient stock for item: ' . $itemModel->name);
                }
                $total += $itemModel->price * $item['quantity'];
                $itemModel->decrement('stock', $item['quantity']);
            }

            $transaction = Transaction::create([
                'user_id' => $validated['user_id'],
                'status' => $validated['status'],
                'total_price' => $total,
                'total_installment' => $validated['status'] === 'installment' ? $validated['total_installment'] : null,
                'paid_at' => $validated['status'] === 'paid' ? now() : null,
            ]);

            foreach ($validated['items'] as $item) {
                $transaction->transactionItems()->create([
                    'item_id' => $item['item_id'],
                    'quantity' => $item['quantity'],
                    'price' => Item::find($item['item_id'])->price,
                ]);
            }

            DB::commit();
            return redirect()->route('transactions.index')->with('success', 'Transaksi berhasil dibuat.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['stock' => $e->getMessage()]);
        }
    }

    public function edit(Transaction $transaction)
    {
        // Load relasi item dari setiap transaction_item
        $transaction->load('transactionItems.item');

        $items = Item::get();

        return Inertia::render('Transactions/Edit', [
            'transaction' => [
                'id' => $transaction->id,
                'status' => $transaction->status,
                'total_installment' => $transaction->total_installment,
                'total_price' => $transaction->total_price,
            ],
            'transaction_items' => $transaction->transactionItems->map(function ($ti) {
                return [
                    'id' => $ti->id,
                    'item_id' => $ti->item_id,
                    'quantity' => $ti->quantity,
                    'price' => $ti->price,
                ];
            }),
            'items' => $items,
            'page_settings' => [
                'title' => 'Edit Transaction',
                'subtitle' => 'Update the transaction details below.',
                'method' => 'PUT',
                'action' => route('transactions.update', $transaction->id),
            ],
        ]);
    }

    public function update(Request $request, Transaction $transaction)
    {

        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'exists:transaction_items,id'],
            'items.*.item_id' => ['required', 'exists:items,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'status' => ['required', 'in:paid,installment'],
            'total_installment' => ['required_if:status,installment', 'numeric', 'min:0', 'nullable'],
            'total_price' => ['required', 'numeric', 'min:0'],
        ]);

        DB::beginTransaction();

        try {
            // Update transaksi utama
            $transaction->update([
                'status' => $validated['status'],
                'total_price' => $validated['total_price'],
                'total_installment' => $validated['status'] === 'installment'
                    ? $validated['total_installment']
                    : null,
            ]);

            // Update setiap item transaksi dan stok item terkait
            foreach ($validated['items'] as $itemData) {
                $transactionItem = $transaction->transactionItems()->where('id', $itemData['id'])->first();

                if (!$transactionItem) continue;

                $oldQty = $transactionItem->quantity;
                $newQty = $itemData['quantity'];
                $item = $transactionItem->item;

                $difference = $newQty - $oldQty;
                if ($difference > 0) {
                    $item->decrement('stock', $difference);
                } elseif ($difference < 0) {
                    $item->increment('stock', abs($difference));
                }

                $transactionItem->update([
                    'quantity' => $newQty,
                    'price' => Item::find($itemData['item_id'])->price,
                ]);
            }

            DB::commit();
            return to_route('transactions.index')->with('success', 'Transaction updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update transaction: ' . $e->getMessage());
        }
    }

}
