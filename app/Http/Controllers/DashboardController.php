<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
  public function index()
  {
    // Produits en alerte de stock
    $lowStockProducts = Product::whereRaw('stock_quantity <= minimum_stock')
      ->with('category')
      ->get();

    // Statistiques générales
    $totalProducts = Product::count();
    $totalValue = Product::sum(DB::raw('price * stock_quantity'));

    // Statistiques des transactions
    $transactionStats = [
      'total' => Transaction::count(),
      'in' => Transaction::where('type', 'in')->count(),
      'out' => Transaction::where('type', 'out')->count(),
      'today' => Transaction::whereDate('created_at', Carbon::today())->count(),
      'this_week' => Transaction::whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->count(),
      'this_month' => Transaction::whereMonth('created_at', Carbon::now()->month)->count(),
    ];

    // Statistiques financières
    $financialStats = [
      'total_purchases' => Transaction::where('type', 'in')
        ->sum(DB::raw('purchase_price * quantity')),
      'total_sales' => Transaction::where('type', 'out')
        ->sum(DB::raw('sale_price * quantity')),
      'total_profit' => Transaction::where('type', 'out')
        ->sum(DB::raw('(sale_price - purchase_price) * quantity')),
      'monthly_sales' => Transaction::where('type', 'out')
        ->whereMonth('created_at', Carbon::now()->month)
        ->sum(DB::raw('sale_price * quantity')),
      'monthly_profit' => Transaction::where('type', 'out')
        ->whereMonth('created_at', Carbon::now()->month)
        ->sum(DB::raw('(sale_price - purchase_price) * quantity')),
    ];

    // Produits les plus vendus avec bénéfices
    $topProducts = Transaction::where('type', 'out')
      ->select(
        'product_id',
        DB::raw('SUM(quantity) as total_quantity'),
        DB::raw('SUM(sale_price * quantity) as total_sales'),
        DB::raw('SUM((sale_price - purchase_price) * quantity) as total_profit')
      )
      ->with('product')
      ->groupBy('product_id')
      ->orderByDesc('total_quantity')
      ->take(5)
      ->get();

    // Évolution des stocks par catégorie
    $stockByCategory = Category::withCount([
      'products' => function ($query) {
        $query->select(DB::raw('SUM(stock_quantity)'));
      }
    ])
      ->withSum('products', 'stock_quantity')
      ->get();

    // Valeur des stocks par catégorie
    $valueByCategory = Category::withSum([
      'products' => function ($query) {
        $query->select(DB::raw('SUM(price * stock_quantity)'));
      }
    ], 'price')
      ->get();

    // Transactions récentes
    $recentTransactions = Transaction::with('product')
      ->latest()
      ->take(5)
      ->get();

    // Statistiques d'alerte de stock
    $stockAlerts = [
      'total' => $lowStockProducts->count(),
      'critical' => $lowStockProducts->where('stock_quantity', 0)->count(),
      'warning' => $lowStockProducts->where('stock_quantity', '>', 0)->count(),
    ];

    return Inertia::render('Dashboard', [
      'lowStockProducts' => $lowStockProducts,
      'totalProducts' => $totalProducts,
      'totalValue' => $totalValue,
      'recentTransactions' => $recentTransactions,
      'transactionStats' => $transactionStats,
      'financialStats' => $financialStats,
      'topProducts' => $topProducts,
      'stockByCategory' => $stockByCategory,
      'valueByCategory' => $valueByCategory,
      'stockAlerts' => $stockAlerts,
    ]);
  }
}
