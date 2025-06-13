<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
  public function index()
  {
    $products = Product::with('category')
      ->latest()
      ->paginate(20);

    return response()->json($products);
  }

  public function show(Product $product)
  {
    return response()->json($product->load('category'));
  }

  public function store(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'name' => 'required|string|max:255',
      'category_id' => 'required|exists:categories,id',
      'description' => 'nullable|string',
      'price' => 'required|numeric|min:0',
      'stock_quantity' => 'required|integer|min:0',
      'minimum_stock' => 'required|integer|min:0',
      'barcode' => 'nullable|string|unique:products',
    ]);

    if ($validator->fails()) {
      return response()->json(['errors' => $validator->errors()], 422);
    }

    $product = Product::create($request->all());

    return response()->json($product, 201);
  }

  public function update(Request $request, Product $product)
  {
    $validator = Validator::make($request->all(), [
      'name' => 'required|string|max:255',
      'category_id' => 'required|exists:categories,id',
      'description' => 'nullable|string',
      'price' => 'required|numeric|min:0',
      'stock_quantity' => 'required|integer|min:0',
      'minimum_stock' => 'required|integer|min:0',
      'barcode' => 'nullable|string|unique:products,barcode,' . $product->id,
    ]);

    if ($validator->fails()) {
      return response()->json(['errors' => $validator->errors()], 422);
    }

    $product->update($request->all());

    return response()->json($product);
  }

  public function destroy(Product $product)
  {
    $product->delete();

    return response()->json(null, 204);
  }

  public function lowStock()
  {
    $products = Product::whereRaw('stock_quantity <= minimum_stock')
      ->with('category')
      ->get();

    return response()->json($products);
  }
}
