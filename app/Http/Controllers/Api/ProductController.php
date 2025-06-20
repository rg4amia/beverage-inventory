<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\ActionLog;

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
            'purchase_price' => 'required|numeric|min:0',
            'sale_price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'minimum_stock' => 'required|integer|min:0',
            'barcode' => 'nullable|string|unique:products',
            'image' => 'nullable|image|max:2048'
        ]);

        $validated = $request->all();

        logger()->info($validator->errors());

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            $validated['slug'] = Str::slug($validated['name']);

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('products', 'public');
                $validated['image_path'] = $path;
            }

            $product = Product::create($validated);

            ActionLog::create([
                'user_id' => Auth::id(),
                'action' => "Produit #{$product->id} créée par " . Auth::user()->name,
                'date_heure' => now(),
            ]);

            logger()->info($product);

            DB::commit();

        } catch (\Exception $e) {

            logger()->info($e->getMessage());
            DB::rollBack();
        }

        $product = Product::find($product->id);

        return response()->json($product, 201);
  }

  public function update(UpdateProductRequest $request, Product $product)
  {
    $validated = $request->validated();

    $product->update($validated);

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
