<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
  public function index()
  {
    $lowStockProducts = Product::whereRaw('stock_quantity <= minimum_stock')
      ->with('category')
      ->get();

    $totalProducts = Product::count();

    $totalValue = Product::sum(DB::raw('price * stock_quantity'));

    $recentTransactions = Transaction::with('product')
      ->latest()
      ->take(5)
      ->get();

    return Inertia::render('Dashboard', [
      'lowStockProducts' => $lowStockProducts,
      'totalProducts' => $totalProducts,
      'totalValue' => $totalValue,
      'recentTransactions' => $recentTransactions,
    ]);
  }
}
