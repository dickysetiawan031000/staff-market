<?php

use App\Http\Controllers\ItemController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


//Route::get('/', function () {
//    return Inertia::render('Dashboard');
//})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware(['auth', \Spatie\Permission\Middleware\RoleMiddleware::class . ':admin', 'verified'])->group(function () {
    Route::resource('items', ItemController::class);
//    Route::resource('transactions', \App\Http\Controllers\TransactionController::class);
    Route::resource('users', \App\Http\Controllers\UserController::class);
    Route::put('/users/{user}/toggle-status', [\App\Http\Controllers\UserController::class, 'toggleStatus'])->name('users.toggle-status');
});

Route::get('/', [\App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware(['auth', \Spatie\Permission\Middleware\RoleMiddleware::class . ':staff|admin', 'verified'])->group(function () {
    Route::resource('transactions', \App\Http\Controllers\TransactionController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
