<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'purchase_price' => 'required|numeric|min:0',
            'sale_price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'minimum_stock' => 'required|integer|min:0',
            'barcode' => 'nullable|string|unique:products,barcode,' . $this->product->id,
            'image' => 'nullable|image|max:2048'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom est requis',
            'name.string' => 'Le nom doit être une chaîne de caractères',
            'name.max' => 'Le nom ne doit pas dépasser 255 caractères',
            'category_id.required' => 'La catégorie est requise',
            'category_id.exists' => 'La catégorie n\'existe pas',
            'description.string' => 'La description doit être une chaîne de caractères',
            'price.required' => 'Le prix est requis',
            'price.numeric' => 'Le prix doit être un nombre',
            'price.min' => 'Le prix doit être supérieur à 0',
            'purchase_price.required' => 'Le prix d\'achat est requis',
            'purchase_price.numeric' => 'Le prix d\'achat doit être un nombre',
            'purchase_price.min' => 'Le prix d\'achat doit être supérieur à 0',
            'sale_price.required' => 'Le prix de vente est requis',
            'sale_price.numeric' => 'Le prix de vente doit être un nombre',
            'sale_price.min' => 'Le prix de vente doit être supérieur à 0',
            'stock_quantity.required' => 'La quantité en stock est requise',
            'stock_quantity.integer' => 'La quantité en stock doit être un nombre entier',
            'stock_quantity.min' => 'La quantité en stock doit être supérieure à 0',
            'minimum_stock.required' => 'La quantité minimale en stock est requise',
            'minimum_stock.integer' => 'La quantité minimale en stock doit être un nombre entier',
            'minimum_stock.min' => 'La quantité minimale en stock doit être supérieure à 0',
            'barcode.unique' => 'Le code barre doit être unique',
            'image.image' => 'L\'image doit être une image',
            'image.max' => 'L\'image ne doit pas dépasser 2048 ko',
            'image.nullable' => 'L\'image est facultative',
            'barcode.nullable' => 'Le code barre est facultatif',
            'barcode.string' => 'Le code barre doit être une chaîne de caractères',
            'barcode.exists' => 'Le code barre n\'existe pas',
            'barcode.required' => 'Le code barre est requis',
            'barcode.numeric' => 'Le code barre doit être un nombre',
            'barcode.min' => 'Le code barre doit être supérieur à 0',
        ];
    }
}
