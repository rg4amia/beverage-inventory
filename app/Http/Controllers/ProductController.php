<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
  public function index()
  {
    $products = Product::with('category')
      ->latest()
      ->paginate(10);

    return Inertia::render('Products/Index', [
      'products' => $products
    ]);
  }

  public function create()
  {
    $categories = Category::all();

    return Inertia::render('Products/Create', [
      'categories' => $categories
    ]);
  }

  public function store(Request $request)
  {
    $validated = $request->validate([
      'name' => 'required|string|max:255',
      'category_id' => 'required|exists:categories,id',
      'description' => 'nullable|string',
      'price' => 'required|numeric|min:0',
      'stock_quantity' => 'required|integer|min:0',
      'minimum_stock' => 'required|integer|min:0',
      'barcode' => 'nullable|string|unique:products',
      'image' => 'nullable|image|max:2048'
    ]);

    $validated['slug'] = Str::slug($validated['name']);

    if ($request->hasFile('image')) {
      $path = $request->file('image')->store('products', 'public');
      $validated['image_path'] = $path;
    }

    Product::create($validated);

    return redirect()->route('products.index')
      ->with('success', 'Produit créé avec succès.');
  }

  public function edit(Product $product)
  {
    $categories = Category::all();

    return Inertia::render('Products/Edit', [
      'product' => $product->load('category'),
      'categories' => $categories
    ]);
  }

  public function update(Request $request, Product $product)
  {
    $validated = $request->validate([
      'name' => 'required|string|max:255',
      'category_id' => 'required|exists:categories,id',
      'description' => 'nullable|string',
      'price' => 'required|numeric|min:0',
      'stock_quantity' => 'required|integer|min:0',
      'minimum_stock' => 'required|integer|min:0',
      'barcode' => 'nullable|string|unique:products,barcode,' . $product->id,
      'image' => 'nullable|image|max:2048'
    ]);

    $validated['slug'] = Str::slug($validated['name']);

    if ($request->hasFile('image')) {
      $path = $request->file('image')->store('products', 'public');
      $validated['image_path'] = $path;
    }

    $product->update($validated);

    return redirect()->route('products.index')
      ->with('success', 'Produit mis à jour avec succès.');
  }

  public function destroy(Product $product)
  {
    $product->delete();

    return redirect()->route('products.index')
      ->with('success', 'Produit supprimé avec succès.');
  }
}
