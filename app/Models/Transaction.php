<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
  use HasFactory;

  protected $fillable = [
    'product_id',
    'user_id',
    'type',
    'quantity',
    'unit_price',
    'total_price',
    'notes',
  ];

  protected $casts = [
    'quantity' => 'integer',
    'unit_price' => 'decimal:2',
    'total_price' => 'decimal:2',
  ];

  public function product(): BelongsTo
  {
    return $this->belongsTo(Product::class);
  }

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }
}
