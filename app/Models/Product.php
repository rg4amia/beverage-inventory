<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
  use HasFactory;

  protected $fillable = [
    'category_id',
    'name',
    'slug',
    'description',
    'price',
    'stock_quantity',
    'minimum_stock',
    'barcode',
    'image_path',
  ];

  protected $casts = [
    'price' => 'decimal:2',
    'stock_quantity' => 'integer',
    'minimum_stock' => 'integer',
  ];

  public function category(): BelongsTo
  {
    return $this->belongsTo(Category::class);
  }

  public function transactions(): HasMany
  {
    return $this->hasMany(Transaction::class);
  }

  public function isLowStock(): bool
  {
    return $this->stock_quantity <= $this->minimum_stock;
  }
}
