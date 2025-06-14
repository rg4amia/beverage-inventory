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
    public function index()
    {
        $products = Product::with('category')
            ->latest()
            ->paginate(6);

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
            dd($e->getMessage());
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
