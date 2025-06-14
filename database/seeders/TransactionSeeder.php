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
   [
    'product_id' => 3, // Corona Extra
    'user_id' => 1,
    'type' => 'in',
    'quantity' => 60,
    'unit_price' => 2.30,
    'total_price' => 138.00,
    'notes' => 'Summer stock purchase',
   ],
   [
    'product_id' => 6, // Dom Pérignon
    'user_id' => 1,
    'type' => 'in',
    'quantity' => 10,
    'unit_price' => 180.00,
    'total_price' => 1800.00,
    'notes' => 'Holiday season stock',
   ],
   [
    'product_id' => 9, // Grey Goose Vodka
    'user_id' => 1,
    'type' => 'in',
    'quantity' => 25,
    'unit_price' => 30.00,
    'total_price' => 750.00,
    'notes' => 'Regular stock replenishment',
   ],
   [
    'product_id' => 13, // Red Bull
    'user_id' => 1,
    'type' => 'in',
    'quantity' => 100,
    'unit_price' => 2.00,
    'total_price' => 200.00,
    'notes' => 'Bulk purchase for summer',
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
    'product_id' => 3, // Corona Extra
    'user_id' => 1,
    'type' => 'out',
    'quantity' => 24,
    'unit_price' => 2.79,
    'total_price' => 66.96,
    'notes' => 'Beach party order',
   ],
   [
    'product_id' => 6, // Dom Pérignon
    'user_id' => 1,
    'type' => 'out',
    'quantity' => 2,
    'unit_price' => 199.99,
    'total_price' => 399.98,
    'notes' => 'Wedding celebration',
   ],
   [
    'product_id' => 9, // Grey Goose Vodka
    'user_id' => 1,
    'type' => 'out',
    'quantity' => 5,
    'unit_price' => 34.99,
    'total_price' => 174.95,
    'notes' => 'Bar restock',
   ],
   [
    'product_id' => 13, // Red Bull
    'user_id' => 1,
    'type' => 'out',
    'quantity' => 48,
    'unit_price' => 2.49,
    'total_price' => 119.52,
    'notes' => 'Office party order',
   ],
   [
    'product_id' => 17, // Pina Colada Mix
    'user_id' => 1,
    'type' => 'out',
    'quantity' => 10,
    'unit_price' => 13.99,
    'total_price' => 139.90,
    'notes' => 'Summer promotion',
   ],
  ];

  foreach ($transactions as $transaction) {
   Transaction::create($transaction);
  }
 }
}
