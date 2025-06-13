<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
 public function run(): void
 {
  $categories = [
   [
    'name' => 'Beer',
    'description' => 'Various types of beer including lagers, ales, and stouts',
   ],
   [
    'name' => 'Wine',
    'description' => 'Red, white, and sparkling wines from different regions',
   ],
   [
    'name' => 'Spirits',
    'description' => 'Hard liquors including whiskey, vodka, rum, and gin',
   ],
   [
    'name' => 'Non-Alcoholic',
    'description' => 'Soft drinks, juices, and other non-alcoholic beverages',
   ],
   [
    'name' => 'Cocktails',
    'description' => 'Pre-mixed cocktails and cocktail ingredients',
   ],
  ];

  foreach ($categories as $category) {
   Category::create([
    'name' => $category['name'],
    'slug' => Str::slug($category['name']),
    'description' => $category['description'],
   ]);
  }
 }
}
