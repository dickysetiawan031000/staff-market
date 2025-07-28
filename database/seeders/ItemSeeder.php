<?php

namespace Database\Seeders;

use App\Models\Item;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        Item::create([
            'item_code' => 'M001',
            'name' => 'Telur',
            'price' => 2000,
            'stock' => 100,
        ]);

        // Add more items as needed
        Item::create([
            'item_code' => 'M002',
            'name' => 'Minyak Goreng',
            'price' => 10000,
            'stock' => 50,
        ]);
    }
}
