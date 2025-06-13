<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
 public function run(): void
 {
  $products = [
   // Beer Category
   [
    'category_id' => 1,
    'name' => 'Heineken Lager',
    'description' => 'Premium lager beer with a balanced taste',
    'price' => 2.99,
    'stock_quantity' => 100,
    'minimum_stock' => 20,
    'barcode' => '8712000000000',
   ],
   [
    'category_id' => 1,
    'name' => 'Guinness Stout',
    'description' => 'Dark Irish stout with rich, creamy head',
    'price' => 3.49,
    'stock_quantity' => 75,
    'minimum_stock' => 15,
    'barcode' => '5000213000000',
   ],
   // Wine Category
   [
    'category_id' => 2,
    'name' => 'Château Margaux',
    'description' => 'Premium French red wine',
    'price' => 599.99,
    'stock_quantity' => 10,
    'minimum_stock' => 2,
    'barcode' => '3010000000000',
   ],
   // Spirits Category
   [
    'category_id' => 3,
    'name' => 'Johnnie Walker Black Label',
    'description' => 'Blended Scotch whisky',
    'price' => 39.99,
    'stock_quantity' => 50,
    'minimum_stock' => 10,
    'barcode' => '5000267000000',
   ],
   // Non-Alcoholic Category
   [
    'category_id' => 4,
    'name' => 'Coca-Cola',
    'description' => 'Classic carbonated soft drink',
    'price' => 1.99,
    'stock_quantity' => 200,
    'minimum_stock' => 50,
    'barcode' => '5449000000000',
   ],
   // Cocktails Category
   [
    'category_id' => 5,
    'name' => 'Mojito Mix',
    'description' => 'Pre-mixed mojito cocktail',
    'price' => 12.99,
    'stock_quantity' => 30,
    'minimum_stock' => 5,
    'barcode' => '8000000000000',
   ],
  ];

  foreach ($products as $product) {
   Product::create([
    'category_id' => $product['category_id'],
    'name' => $product['name'],
    'slug' => Str::slug($product['name']),
    'description' => $product['description'],
    'price' => $product['price'],
    'stock_quantity' => $product['stock_quantity'],
    'minimum_stock' => $product['minimum_stock'],
    'barcode' => $product['barcode'],
   ]);
  }
 }
}
