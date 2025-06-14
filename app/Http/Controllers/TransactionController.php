<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Product;
use App\Models\ActionLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

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
      'quantity' => 'required|integer|min:1',
      'unit_price' => 'required|numeric|min:0',
      'type' => 'required|in:in,out',
      'notes' => 'nullable|string',
    ]);

    try {
      DB::beginTransaction();

      $product = Product::findOrFail($validated['product_id']);

      // Vérifier le stock pour les sorties
      if ($request->type === 'out' && $product->stock_quantity < $validated['quantity']) {
        return back()->withErrors([
          'quantity' => 'Stock insuffisant. Stock disponible: ' . $product->stock_quantity
        ])->withInput();
      }

      // Créer la transaction
     $transaction = Transaction::create([
        'product_id' => $validated['product_id'],
        'user_id' => Auth::id(),
        'type' => $request->type,
        'quantity' => $validated['quantity'],
        'unit_price' => $validated['unit_price'],
        'total_price' => $validated['quantity'] * $validated['unit_price'],
        'notes' => $validated['notes'],
        'purchase_price' => $request->type === 'in' ? $validated['unit_price'] : null,
        'sale_price' => $request->type === 'out' ? $validated['unit_price'] : null,
      ]);

      // Mettre à jour le stock
      $product->stock_quantity += ($request->type === 'in' ? $validated['quantity'] : -$validated['quantity']);
      $product->save();

        // Log the action
      ActionLog::create([
          'user_id' => Auth::id(),
          'action' => "Transaction #{$transaction->id} créée par " . Auth::user()->name,
          'date_heure' => now(),
      ]);

      DB::commit();

      return redirect()->route('transactions.index')
        ->with('success', 'Transaction enregistrée avec succès.');
    } catch (\Exception $e) {
      logger()->warning($e->getMessage() .''. $e->getTraceAsString() .' ligne' . $e->getLine());
      DB::rollBack();
      return back()->withErrors([
        'error' => 'Une erreur est survenue lors de l\'enregistrement de la transaction.'
      ])->withInput();
    }
  }

  public function edit(Transaction $transaction)
  {
    $products = Product::all();
    return Inertia::render('Transactions/Edit', [
      'transaction' => $transaction->load('product'),
      'products' => $products
    ]);
  }

  public function update(Request $request, Transaction $transaction)
  {
    $validated = $request->validate([
      'product_id' => 'required|exists:products,id',
      'quantity' => 'required|integer|min:1',
      'unit_price' => 'required|numeric|min:0',
      'notes' => 'nullable|string',
    ]);

    try {
      DB::beginTransaction();

      $product = Product::findOrFail($validated['product_id']);
      $oldQuantity = $transaction->quantity;
      $oldProductId = $transaction->product_id;

      // Vérifier le stock pour les sorties
      if ($transaction->type === 'out') {
        $stockDifference = $oldQuantity - $validated['quantity'];
        if ($product->stock_quantity + $stockDifference < 0) {
          return back()->withErrors([
            'quantity' => 'Stock insuffisant. Stock disponible: ' . $product->stock_quantity
          ])->withInput();
        }
      }

      // Mettre à jour la transaction
      $transaction->update([
        'product_id' => $validated['product_id'],
        'quantity' => $validated['quantity'],
        'unit_price' => $validated['unit_price'],
        'total_price' => $validated['quantity'] * $validated['unit_price'],
        'notes' => $validated['notes'],
        'purchase_price' => $transaction->type === 'in' ? $validated['unit_price'] : null,
        'sale_price' => $transaction->type === 'out' ? $validated['unit_price'] : null,
      ]);

      // Mettre à jour le stock
      if ($oldProductId === $validated['product_id']) {
        // Même produit
        $product->stock_quantity += ($transaction->type === 'in' ? $validated['quantity'] - $oldQuantity : $oldQuantity - $validated['quantity']);
      } else {
        // Produit différent
        $oldProduct = Product::find($oldProductId);
        $oldProduct->stock_quantity += ($transaction->type === 'in' ? -$oldQuantity : $oldQuantity);
        $oldProduct->save();

        $product->stock_quantity += ($transaction->type === 'in' ? $validated['quantity'] : -$validated['quantity']);
      }
      $product->save();

      // Log the action
      ActionLog::create([
        'user_id' => Auth::id(),
        'action' => "Transaction #{$transaction->id} mise à jour",
        'date_heure' => now(),
      ]);

      DB::commit();

      return redirect()->route('transactions.index')
        ->with('success', 'Transaction mise à jour avec succès.');
    } catch (\Exception $e) {
      DB::rollBack();
      return back()->withErrors([
        'error' => 'Une erreur est survenue lors de la mise à jour de la transaction.'
      ])->withInput();
    }
  }

  public function destroy(Transaction $transaction)
  {
    try {
      DB::beginTransaction();

      $product = $transaction->product;

      // Mettre à jour le stock
      $product->stock_quantity += ($transaction->type === 'in' ? -$transaction->quantity : $transaction->quantity);
      $product->save();

      // Log the action before deleting
      ActionLog::create([
        'user_id' => Auth::id(),
        'action' => "Transaction #{$transaction->id} supprimée",
        'date_heure' => now(),
      ]);

      // Soft delete the transaction
      $transaction->delete();

      DB::commit();

      return redirect()->route('transactions.index')
        ->with('success', 'Transaction supprimée avec succès.');
    } catch (\Exception $e) {
      DB::rollBack();
      return back()->withErrors([
        'error' => 'Une erreur est survenue lors de la suppression de la transaction.'
      ]);
    }
  }
}
