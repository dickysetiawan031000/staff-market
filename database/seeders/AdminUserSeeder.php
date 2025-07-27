<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@staffmarket.com'],
            [
                'name' => 'Administrator',
                'password' => bcrypt('password'),
                'employee_id' => 'admin',
                'address' => 'Admin Street',
                'phone_number' => '1234567890',
            ]
        );

        $admin->assignRole('admin');
    }
}
