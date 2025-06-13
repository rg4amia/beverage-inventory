<?php

namespace Database\Seeders;

use App\Models\Transaction;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
 public function run(): void
 {
  $transactions = [
   // Stock in transactions
   [
    'product_id' => 1, // Heineken Lager
    'user_id' => 1,
    'type' => 'in',
    'quantity' => 50,
    'unit_price' => 2.50,
    'total_price' => 125.00,
    'notes' => 'Initial stock purchase',
   ],
   [
    'product_id' => 2, // Guinness Stout
    'user_id' => 1,
    'type' => 'in',
    'quantity' => 30,
    'unit_price' => 3.00,
    'total_price' => 90.00,
    'notes' => 'Initial stock purchase',
   ],
   // Stock out transactions
   [
    'product_id' => 1, // Heineken Lager
    'user_id' => 1,
    'type' => 'out',
    'quantity' => 10,
    'unit_price' => 2.99,
    'total_price' => 29.90,
    'notes' => 'Regular sale',
   ],
   [
    'product_id' => 3, // Château Margaux
    'user_id' => 1,
    'type' => 'out',
    'quantity' => 1,
    'unit_price' => 599.99,
    'total_price' => 599.99,
    'notes' => 'Premium wine sale',
   ],
  ];

  foreach ($transactions as $transaction) {
   Transaction::create($transaction);
  }
 }
}
