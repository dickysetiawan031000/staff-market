<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmployeeUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = [
            [
                'name' => 'Employee One',
                'email' => 'employee1@staffmarket.com',
                'password' => bcrypt('password'),
                'employee_id' => 'EMP000001',
                'address' => 'Employee One Street',
                'phone_number' => '1234567891'
            ],
            [
                'name' => 'Employee Two',
                'email' => 'employee2@staffmarket.com',
                'password' => bcrypt('password'),
                'employee_id' => 'EMP000002',
                'address' => 'Employee Two Street',
                'phone_number' => '1234567892'
            ]
        ];

        foreach ($employees as $employeeData) {
            $employee = \App\Models\User::firstOrCreate(
                ['email' => $employeeData['email']],
                $employeeData
            );

            $employee->assignRole('staff');
        }

    }
}
