<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
  public function index()
  {
    $categories = Category::withCount('products')
      ->latest()
      ->paginate(10);

    return Inertia::render('Categories/Index', [
      'categories' => $categories
    ]);
  }

  public function create()
  {
    return Inertia::render('Categories/Create');
  }

  public function store(Request $request)
  {
    $validated = $request->validate([
      'name' => 'required|string|max:255|unique:categories',
      'description' => 'nullable|string'
    ]);

    $validated['slug'] = Str::slug($validated['name']);

    Category::create($validated);

    return redirect()->route('categories.index')
      ->with('success', 'Catégorie créée avec succès.');
  }

  public function edit(Category $category)
  {
    return Inertia::render('Categories/Edit', [
      'category' => $category
    ]);
  }

  public function update(Request $request, Category $category)
  {
    $validated = $request->validate([
      'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
      'description' => 'nullable|string'
    ]);

    $validated['slug'] = Str::slug($validated['name']);

    $category->update($validated);

    return redirect()->route('categories.index')
      ->with('success', 'Catégorie mise à jour avec succès.');
  }

  public function destroy(Category $category)
  {
    if ($category->products()->count() > 0) {
      return redirect()->route('categories.index')
        ->with('error', 'Impossible de supprimer une catégorie contenant des produits.');
    }

    $category->delete();

    return redirect()->route('categories.index')
      ->with('success', 'Catégorie supprimée avec succès.');
  }
}
