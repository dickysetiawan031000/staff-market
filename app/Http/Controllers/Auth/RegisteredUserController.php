<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'address' => 'required|string|max:255',
            'phone_number' => 'required|string|max:15|regex:/^(\+?\d{1,3}[- ]?)?\d{10}$/',
        ]);

        // generate employee_id
        $lastEmployeeId = User::orderByDesc('id')->value('employee_id');
        $lastNumber = $lastEmployeeId ? (int)substr($lastEmployeeId, 3) : 0;
        $employeeId = $lastNumber + 1;
        $formattedEmployeeId = 'EMP' . str_pad($employeeId, 6, '0', STR_PAD_LEFT);


        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'address' => $request->address,
            'phone_number' => $request->phone_number,
            'employee_id' => $formattedEmployeeId,
        ]);

        event(new Registered($user));

        Auth::login($user);

        $user->assignRole('staff');

        return redirect(route('dashboard', absolute: false));
    }
}
