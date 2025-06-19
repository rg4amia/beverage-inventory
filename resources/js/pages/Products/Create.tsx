import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { type BreadcrumbItem } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category } from '@/types';
import { useState } from 'react';

interface Props {
  categories: Category[];
}

export default function Create({ categories }: Props) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    price: '',
    purchase_price: '',
    sale_price: '',
    stock_quantity: '',
    minimum_stock: '',
    category_id: '',
    barcode: '',
    image: null as File | null,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Produits',
      href: route('products.index'),
    },
  ];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('products.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Nouveau produit" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-cave-bordeaux">Nouveau produit</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-200">Nom</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    className="block mt-1 w-full text-gray-900 bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                    required
                  />
                  <InputError message={errors.name} className="mt-2" />
                </div>

                  <div>
                  <Label htmlFor="category_id" className="text-gray-700 dark:text-gray-200">Catégorie</Label>
                  <Select
                    value={data.category_id}
                    onValueChange={(value) => setData('category_id', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <InputError message={errors.category_id} className="mt-2" />
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-700 dark:text-gray-200">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={data.description}
                    className="block mt-1 w-full text-gray-900 bg-white rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:border-cave-bordeaux focus:ring-cave-bordeaux"
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                    rows={3}
                  />
                  <InputError message={errors.description} className="mt-2" />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                  <Label htmlFor="price" className="text-gray-700 dark:text-gray-200">Prix</Label>
                  <Input
                    id="price"
                    type="number"
                    name="price"
                    value={data.price}
                    className="block mt-1 w-full text-gray-900 bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('price', e.target.value)}
                    required
                    step="0.01"
                    min="0"
                  />
                  <InputError message={errors.price} className="mt-2" />
                </div>

                 <div>
                    <Label htmlFor="purchase_price" className="text-gray-700 dark:text-gray-200">Prix d'achat</Label>
                    <Input
                      id="purchase_price"
                      type="number"
                      name="purchase_price"
                      value={data.purchase_price}
                      className="block mt-1 w-full text-gray-900 bg-white border-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('purchase_price', e.target.value)}
                      required
                    />
                    <InputError message={errors.purchase_price} className="mt-2" />
                  </div>

                  <div>
                    <Label htmlFor="sale_price" className="text-gray-700 dark:text-gray-200">Prix de vente</Label>
                    <Input
                      id="sale_price"
                      type="number"
                      name="sale_price"
                      value={data.sale_price}
                      className="block mt-1 w-full text-gray-900 bg-white border-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('sale_price', e.target.value)}
                      required
                    />
                    <InputError message={errors.sale_price} className="mt-2" />
                  </div>

                  <div>
                  <Label htmlFor="stock" className="text-gray-700 dark:text-gray-200">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    name="stock"
                    value={data.stock_quantity}
                    className="block mt-1 w-full text-gray-900 bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('stock_quantity', e.target.value)}
                    required
                    min="0"
                  />
                  <InputError message={errors.stock_quantity} className="mt-2" />
                </div>

                 <div>
                    <Label htmlFor="minimum_stock" className="text-gray-700 dark:text-gray-200">Stock minimum</Label>
                    <Input
                      id="minimum_stock"
                      type="number"
                      name="minimum_stock"
                      value={data.minimum_stock}
                      className="block mt-1 w-full text-gray-900 bg-white border-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('minimum_stock', e.target.value)}
                      required
                    />
                    <InputError message={errors.minimum_stock} className="mt-2" />
                  </div>
                </div>


                <div>
                  <Label htmlFor="barcode" className="text-gray-700 dark:text-gray-200">Code-barres</Label>
                  <Input
                    id="barcode"
                    type="text"
                    name="barcode"
                    value={data.barcode}
                    className="block mt-1 w-full text-gray-900 bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('barcode', e.target.value)}
                  />
                  <InputError message={errors.barcode} className="mt-2" />
                </div>

                <div>
                  <Label htmlFor="image" className="text-gray-700 dark:text-gray-200">Image</Label>
                  <div className="flex gap-4 items-center mt-2">
                    {imagePreview && (
                      <div className="relative w-32 h-32">
                        <img
                          src={imagePreview}
                          alt="Aperçu"
                          className="object-cover w-full h-full rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setData('image', null);
                          }}
                          className="absolute -top-2 -right-2 p-1 text-white bg-red-500 rounded-full hover:bg-red-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-center items-center w-full">
                        <label
                          htmlFor="image"
                          className="flex flex-col justify-center items-center w-full h-32 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
                        >
                          <div className="flex flex-col justify-center items-center pt-5 pb-6">
                            <svg className="mb-4 w-8 h-8 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG ou JPEG (MAX. 2MB)</p>
                          </div>
                          <input
                            id="image"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <InputError message={errors.image} className="mt-2" />
                </div>

                <div className="flex justify-end items-center">
                  <Button
                    type="submit"
                    className="ml-4"
                    disabled={processing}
                  >
                    Créer le produit
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
