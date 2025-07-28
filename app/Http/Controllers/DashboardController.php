<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->hasRole('admin')) {
            $totalTransactions = Transaction::count();
            $paidTransactions = Transaction::where('status', 'paid')->count();
        } else {
            $totalTransactions = Transaction::where('user_id', $user->id)->count();
            $paidTransactions = Transaction::where('user_id', $user->id)->where('status', 'paid')->count();
        }

        $totalItems = Item::count();
        $totalEmployees = User::role('staff')->count();

        return Inertia::render('Dashboard', [
            'total_transactions' => $totalTransactions,
            'paid_transactions' => $paidTransactions,
            'total_items' => $totalItems,
            'total_employees' => $totalEmployees,
        ]);
    }

}
