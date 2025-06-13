<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class StockAlertService
{
  public function getLowStockProducts(): Collection
  {
    return Product::whereRaw('stock_quantity <= minimum_stock')
      ->with('category')
      ->get();
  }

  public function checkAndNotifyLowStock(): void
  {
    $lowStockProducts = $this->getLowStockProducts();

    if ($lowStockProducts->isNotEmpty()) {
      // Ici, vous pouvez implémenter la logique de notification
      // Par exemple, envoyer un email, une notification push, etc.
      foreach ($lowStockProducts as $product) {
        // Exemple de log pour le moment
        Log::warning("Stock bas pour le produit {$product->name} : {$product->stock_quantity} unités restantes");
      }
    }
  }

  public function getStockStatus(Product $product): array
  {
    $status = [
      'is_low' => $product->isLowStock(),
      'current_stock' => $product->stock_quantity,
      'minimum_stock' => $product->minimum_stock,
      'percentage' => ($product->stock_quantity / $product->minimum_stock) * 100,
    ];

    if ($status['is_low']) {
      $status['message'] = "Stock bas : {$product->stock_quantity} unités restantes";
    } else {
      $status['message'] = "Stock suffisant : {$product->stock_quantity} unités";
    }

    return $status;
  }
}
