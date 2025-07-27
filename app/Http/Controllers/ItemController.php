<?php

namespace App\Http\Controllers;

use App\Http\Requests\ItemRequest;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemController extends Controller
{
    public function index(Request $request)
    {
        $query = Item::query();

        if ($search = $request->get('search')) {
            $query->whereRaw('LOWER(name) like ?', ['%' . strtolower($search) . '%'])
                ->orWhereRaw('LOWER(item_code) like ?', ['%' . strtolower($search) . '%']);
        }

        $items = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('Items/Index', [
            'items' => $items,
            'filters' => $request->only('search'),
        ]);
    }
    public function create()
    {
        return Inertia::render('Items/Create',[
            'page_settings' => [
                'title' => 'Create Item',
                'subtitle' => 'Fill in the form below to create a new Item.',
                'method' => 'POST',
                'action' => route('items.store'),
            ],
        ]);
    }

    public function store(ItemRequest $request)
    {
        Item::create($request->all());
        return redirect()->route('items.index')->with('success', 'Item created successfully.');
    }

    public function edit(Item $item)
    {
        return Inertia::render('Items/Edit', [
            'item' => $item,
            'page_settings' => [
                'title' => 'Edit Item',
                'subtitle' => 'Update the item details below.',
            ],
        ]);
    }

    public function update(ItemRequest $request, Item $item)
    {
        $item->update($request->validated());

        return redirect()->route('items.index')->with([
            'type' => 'success',
            'message' => 'Item updated successfully.',
        ]);
    }

    public function destroy(Item $item)
    {
        $item->delete();
        return redirect()->route('items.index')->with('success', 'Item deleted successfully.');
    }
}
