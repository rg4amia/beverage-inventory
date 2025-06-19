<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\ActionLog;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category');

        // Recherche par nom
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('name', 'like', '%' . $search . '%');
        }

        // Recherche par catégorie
        if ($request->has('category') && !empty($request->get('category'))) {
            $category = $request->get('category');
            if (is_array($category)) {
                $query->whereIn('category_id', $category);
            } else {
                $query->where('category_id', $category);
            }
        }

        // Recherche par prix minimum
        if ($request->has('min_price')) {
            //$query->where('price', '>=', $request->get('min_price'));
        }

        // Recherche par prix maximum
        if ($request->has('max_price')) {
            //$query->where('price', '<=', $request->get('max_price'));
        }

        // Recherche par stock minimum
        if ($request->has('min_stock')) {
            // $query->where('stock_quantity', '>=', $request->get('min_stock'));
        }

        $products = $query->latest()->paginate(6);

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => $request->only(['search', 'category', 'min_price', 'max_price', 'min_stock']),
            'categories' => Category::all()
        ]);
    }

    public function create()
    {
        $categories = Category::all();

        return Inertia::render('Products/Create', [
            'categories' => $categories
        ]);
    }

    public function store(CreateProductRequest $request)
    {
        $validated = $request->validated();

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

            DB::commit();

            return redirect()->route('products.index')
                ->with('success', 'Produit créé avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors([
                'error' => 'Une erreur est survenue lors de la création du produit.'
            ])->withInput();
        }
    }

    public function edit(Product $product)
    {
        $categories = Category::all();

        return Inertia::render('Products/Edit', [
            'product' => $product->load('category'),
            'categories' => $categories
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();

            $validated['slug'] = Str::slug($validated['name']);

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('products', 'public');
                $validated['image_path'] = $path;
            }

            $product->update($validated);

            ActionLog::create([
                'user_id' => Auth::id(),
                'action' => "Produit #{$product->id} mise à jour par " . Auth::user()->name,
                'date_heure' => now(),
            ]);

            DB::commit();

            return redirect()->route('products.index')
                ->with('success', 'Produit mis à jour avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors([
                'error' => 'Une erreur est survenue lors de la mise à jour du produit.'
            ])->withInput();
        }
    }

    public function destroy(Product $product)
    {
        ActionLog::create([
            'user_id' => Auth::id(),
            'action' => "Produit #{$product->id} supprimé par " . Auth::user()->name,
            'date_heure' => now(),
        ]);
        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'Produit supprimé avec succès.');
    }
}
