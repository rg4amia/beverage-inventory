import { Head, useForm } from '@inertiajs/react';
import { Category } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';

interface Props {
  categories: Category[];
}

export default function Create({ categories }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    category_id: '',
    description: '',
    price: '',
    purchase_price: '',
    sale_price: '',
    stock_quantity: '',
    minimum_stock: '',
    barcode: '',
    image: null as File | null,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('products.store'));
  };

  return (
    <AppLayout>
      <Head title="Nouveau produit" />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <div className="p-6">
              <h2 className="mb-6 text-2xl font-semibold text-cave-bordeaux">Nouveau produit</h2>

              <form onSubmit={submit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-200">Nom</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    className="block mt-1 w-full text-gray-900 bg-white border-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
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
                    <SelectTrigger className="w-full text-gray-900 bg-white border-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600">
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()} className="text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
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
                    className="block mt-1 w-full text-gray-900 bg-white rounded-md border-gray-300 shadow-sm dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:border-cave-bordeaux focus:ring-cave-bordeaux"
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
                      step="0.01"
                      name="price"
                      value={data.price}
                      className="block mt-1 w-full text-gray-900 bg-white border-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('price', e.target.value)}
                      required
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
                    <Label htmlFor="stock_quantity" className="text-gray-700 dark:text-gray-200">Quantité en stock</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      name="stock_quantity"
                      value={data.stock_quantity}
                      className="block mt-1 w-full text-gray-900 bg-white border-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('stock_quantity', e.target.value)}
                      required
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
                    className="block mt-1 w-full text-gray-900 bg-white border-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('barcode', e.target.value)}
                  />
                  <InputError message={errors.barcode} className="mt-2" />
                </div>

                <div>
                  <Label htmlFor="image" className="text-gray-700 dark:text-gray-200">Image</Label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    className="block mt-1 w-full text-gray-900 dark:text-gray-200"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('image', e.target.files?.[0] || null)}
                  />
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
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
