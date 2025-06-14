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
            [
                'category_id' => 1,
                'name' => 'Corona Extra',
                'description' => 'Light Mexican lager with lime',
                'price' => 2.79,
                'stock_quantity' => 120,
                'minimum_stock' => 25,
                'barcode' => '7501055300000',
            ],
            [
                'category_id' => 1,
                'name' => 'Stella Artois',
                'description' => 'Belgian pilsner with crisp taste',
                'price' => 2.89,
                'stock_quantity' => 90,
                'minimum_stock' => 20,
                'barcode' => '5410228000000',
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
            [
                'category_id' => 2,
                'name' => 'Dom Pérignon',
                'description' => 'Luxury champagne',
                'price' => 199.99,
                'stock_quantity' => 15,
                'minimum_stock' => 3,
                'barcode' => '3010000000001',
            ],
            [
                'category_id' => 2,
                'name' => 'Yellow Tail Shiraz',
                'description' => 'Australian red wine',
                'price' => 12.99,
                'stock_quantity' => 50,
                'minimum_stock' => 10,
                'barcode' => '3010000000002',
            ],
            [
                'category_id' => 2,
                'name' => 'Kendall-Jackson Chardonnay',
                'description' => 'California white wine',
                'price' => 19.99,
                'stock_quantity' => 40,
                'minimum_stock' => 8,
                'barcode' => '3010000000003',
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
            [
                'category_id' => 3,
                'name' => 'Grey Goose Vodka',
                'description' => 'Premium French vodka',
                'price' => 34.99,
                'stock_quantity' => 45,
                'minimum_stock' => 10,
                'barcode' => '5000267000001',
            ],
            [
                'category_id' => 3,
                'name' => 'Bacardi Superior Rum',
                'description' => 'White rum from Puerto Rico',
                'price' => 24.99,
                'stock_quantity' => 60,
                'minimum_stock' => 15,
                'barcode' => '5000267000002',
            ],
            [
                'category_id' => 3,
                'name' => 'Tanqueray Gin',
                'description' => 'London dry gin',
                'price' => 29.99,
                'stock_quantity' => 40,
                'minimum_stock' => 8,
                'barcode' => '5000267000003',
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
            [
                'category_id' => 4,
                'name' => 'Red Bull Energy Drink',
                'description' => 'Energy drink with taurine',
                'price' => 2.49,
                'stock_quantity' => 150,
                'minimum_stock' => 30,
                'barcode' => '5449000000001',
            ],
            [
                'category_id' => 4,
                'name' => 'San Pellegrino Sparkling Water',
                'description' => 'Italian sparkling mineral water',
                'price' => 1.79,
                'stock_quantity' => 180,
                'minimum_stock' => 40,
                'barcode' => '5449000000002',
            ],
            [
                'category_id' => 4,
                'name' => 'Tropicana Orange Juice',
                'description' => '100% pure orange juice',
                'price' => 3.99,
                'stock_quantity' => 80,
                'minimum_stock' => 20,
                'barcode' => '5449000000003',
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
            [
                'category_id' => 5,
                'name' => 'Margarita Mix',
                'description' => 'Pre-mixed margarita cocktail',
                'price' => 11.99,
                'stock_quantity' => 35,
                'minimum_stock' => 7,
                'barcode' => '8000000000001',
            ],
            [
                'category_id' => 5,
                'name' => 'Pina Colada Mix',
                'description' => 'Pre-mixed pina colada cocktail',
                'price' => 13.99,
                'stock_quantity' => 25,
                'minimum_stock' => 5,
                'barcode' => '8000000000002',
            ],
            [
                'category_id' => 5,
                'name' => 'Bloody Mary Mix',
                'description' => 'Pre-mixed bloody mary cocktail',
                'price' => 10.99,
                'stock_quantity' => 40,
                'minimum_stock' => 8,
                'barcode' => '8000000000003',
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
