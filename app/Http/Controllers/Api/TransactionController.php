<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TransactionController extends Controller
{
  public function index()
  {
    $transactions = Transaction::with(['product', 'user'])
      ->latest()
      ->paginate(20);

    return response()->json($transactions);
  }

  public function store(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'product_id' => 'required|exists:products,id',
      'type' => 'required|in:in,out',
      'quantity' => 'required|integer|min:1',
      'unit_price' => 'required|numeric|min:0',
      'notes' => 'nullable|string',
    ]);

    if ($validator->fails()) {
      return response()->json(['errors' => $validator->errors()], 422);
    }

    try {
      DB::beginTransaction();

      $product = Product::findOrFail($request->product_id);

      // Vérifier le stock pour les sorties
      if ($request->type === 'out' && $product->stock_quantity < $request->quantity) {
        return response()->json([
          'error' => 'Stock insuffisant',
          'available' => $product->stock_quantity
        ], 422);
      }

      // Déterminer les prix d'achat et de vente
      $purchase_price = $request->type === 'in' ? $request->unit_price : $product->purchase_price;
      $sale_price = $request->type === 'out' ? $request->unit_price : $product->sale_price;

      // Créer la transaction
      $transaction = Transaction::create([
        'product_id' => $request->product_id,
        'user_id' => auth()->user()->id,
        'type' => $request->type,
        'quantity' => $request->quantity,
        'unit_price' => $request->unit_price,
        'total_price' => $request->quantity * $request->unit_price,
        'purchase_price' => $purchase_price,
        'sale_price' => $sale_price,
        'notes' => $request->notes,
      ]);

      // Mettre à jour le stock
      $product->stock_quantity += ($request->type === 'in' ? $request->quantity : -$request->quantity);

      // Mettre à jour les prix du produit si c'est une entrée
      if ($request->type === 'in') {
        $product->purchase_price = $request->unit_price;
      }

      $product->save();

      DB::commit();

      return response()->json($transaction->load(['product', 'user']), 201);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['error' => 'Une erreur est survenue'], 500);
    }
  }

  public function show(Transaction $transaction)
  {
    return response()->json($transaction->load(['product', 'user']));
  }

  public function statistics()
  {
    $stats = [
      'total_in' => Transaction::where('type', 'in')->sum('total_price'),
      'total_out' => Transaction::where('type', 'out')->sum('total_price'),
      'total_transactions' => Transaction::count(),
      'recent_transactions' => Transaction::with(['product', 'user'])
        ->latest()
        ->take(5)
        ->get(),
    ];

    return response()->json($stats);
  }
}
