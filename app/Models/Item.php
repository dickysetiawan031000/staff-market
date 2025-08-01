<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = [
        'item_code',
        'name',
        'price',
        'stock'
    ];

    public function transactionItems()
    {
        return $this->hasMany(TransactionItem::class);
    }

}
