<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('transactions', function (Blueprint $table) {
      $table->id();
      $table->foreignId('product_id')->constrained()->onDelete('cascade');
      $table->foreignId('user_id')->constrained()->onDelete('cascade');
      $table->enum('type', ['in', 'out']);
      $table->integer('quantity');
      $table->decimal('unit_price', 10, 2)->nullable();
      $table->decimal('purchase_price', 10, 2)->nullable();
      $table->decimal('sale_price', 10, 2)->nullable();
      $table->decimal('total_price', 10, 2)->nullable();
      $table->text('notes')->nullable();
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('transactions');
  }
};
