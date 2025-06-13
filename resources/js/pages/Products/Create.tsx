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
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h2 className="mb-6 text-2xl font-semibold text-cave-bordeaux">Nouveau produit</h2>

              <form onSubmit={submit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    className="block mt-1 w-full"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                    required
                  />
                  <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                  <Label htmlFor="category_id">Catégorie</Label>
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
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={data.description}
                    className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-cave-bordeaux focus:ring-cave-bordeaux"
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                    rows={3}
                  />
                  <InputError message={errors.description} className="mt-2" />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <Label htmlFor="price">Prix</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      name="price"
                      value={data.price}
                      className="block mt-1 w-full"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('price', e.target.value)}
                      required
                    />
                    <InputError message={errors.price} className="mt-2" />
                  </div>

                  <div>
                    <Label htmlFor="stock_quantity">Quantité en stock</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      name="stock_quantity"
                      value={data.stock_quantity}
                      className="block mt-1 w-full"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('stock_quantity', e.target.value)}
                      required
                    />
                    <InputError message={errors.stock_quantity} className="mt-2" />
                  </div>

                  <div>
                    <Label htmlFor="minimum_stock">Stock minimum</Label>
                    <Input
                      id="minimum_stock"
                      type="number"
                      name="minimum_stock"
                      value={data.minimum_stock}
                      className="block mt-1 w-full"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('minimum_stock', e.target.value)}
                      required
                    />
                    <InputError message={errors.minimum_stock} className="mt-2" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="barcode">Code-barres</Label>
                  <Input
                    id="barcode"
                    type="text"
                    name="barcode"
                    value={data.barcode}
                    className="block mt-1 w-full"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('barcode', e.target.value)}
                  />
                  <InputError message={errors.barcode} className="mt-2" />
                </div>

                <div>
                  <Label htmlFor="image">Image</Label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    className="block mt-1 w-full"
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
