<?php

use App\Http\Controllers\ItemController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
});


Route::middleware(['auth', \Spatie\Permission\Middleware\RoleMiddleware::class . ':admin'])->group(function () {
    Route::resource('items', ItemController::class);
    Route::resource('transactions', \App\Http\Controllers\TransactionController::class);
});


//Route::middleware(['auth', \Spatie\Permission\Middleware\RoleMiddleware::class . ':staff'])->group(function () {
//    Route::resource('transactions', \App\Http\Controllers\TransactionController::class);
//});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
