<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionController extends Controller
{
  public function index()
  {
    $transactions = Transaction::with(['product', 'user'])
      ->latest()
      ->paginate(20);

    return Inertia::render('Transactions/Index', [
      'transactions' => $transactions
    ]);
  }

  public function create(Request $request)
  {
    $products = Product::all();

    return Inertia::render('Transactions/Create', [
      'type' => $request->type,
      'products' => $products
    ]);
  }

  public function store(Request $request)
  {
    $validated = $request->validate([
      'product_id' => 'required|exists:products,id',
      'type' => 'required|in:in,out',
      'quantity' => 'required|integer|min:1',
      'unit_price' => 'required|numeric|min:0',
      'notes' => 'nullable|string',
    ]);

    try {
      DB::beginTransaction();

      $product = Product::findOrFail($validated['product_id']);

      // Vérifier le stock pour les sorties
      if ($validated['type'] === 'out' && $product->stock_quantity < $validated['quantity']) {
        return back()->withErrors([
          'quantity' => 'Stock insuffisant. Stock disponible: ' . $product->stock_quantity
        ]);
      }

      // Créer la transaction
      $transaction = Transaction::create([
        'product_id' => $validated['product_id'],
        'user_id' => auth()->id(),
        'type' => $validated['type'],
        'quantity' => $validated['quantity'],
        'unit_price' => $validated['unit_price'],
        'total_price' => $validated['quantity'] * $validated['unit_price'],
        'notes' => $validated['notes'],
      ]);

      // Mettre à jour le stock
      $product->stock_quantity += ($validated['type'] === 'in' ? $validated['quantity'] : -$validated['quantity']);
      $product->save();

      DB::commit();

      return redirect()->route('transactions.index')
        ->with('success', 'Transaction enregistrée avec succès.');
    } catch (\Exception $e) {
      DB::rollBack();
      return back()->withErrors([
        'error' => 'Une erreur est survenue lors de l\'enregistrement de la transaction.'
      ]);
    }
  }
}
