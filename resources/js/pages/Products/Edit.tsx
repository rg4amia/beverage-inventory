import { Head, useForm } from '@inertiajs/react';
import { Product, Category } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';

interface Props {
  product: Product;
  categories: Category[];
}

export default function Edit({ product, categories }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    name: product.name,
    category_id: product.category_id.toString(),
    description: product.description || '',
    price: product.price.toString(),
    stock_quantity: product.stock_quantity.toString(),
    minimum_stock: product.minimum_stock.toString(),
    barcode: product.barcode || '',
    image: null as File | null,
    _method: 'PUT',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('products.update', product.id));
  };

  return (
    <AppLayout>
      <Head title="Modifier le produit" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-cave-bordeaux mb-6">Modifier le produit</h2>

              <form onSubmit={submit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    className="mt-1 block w-full"
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cave-bordeaux focus:ring-cave-bordeaux"
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                    rows={3}
                  />
                  <InputError message={errors.description} className="mt-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="price">Prix</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      name="price"
                      value={data.price}
                      className="mt-1 block w-full"
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
                      className="mt-1 block w-full"
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
                      className="mt-1 block w-full"
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
                    className="mt-1 block w-full"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('barcode', e.target.value)}
                  />
                  <InputError message={errors.barcode} className="mt-2" />
                </div>

                <div>
                  <Label htmlFor="image">Image</Label>
                  {product.image && (
                    <div className="mt-2 mb-4">
                      <img
                        src={`/storage/${product.image}`}
                        alt={product.name}
                        className="h-32 w-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    id="image"
                    name="image"
                    className="mt-1 block w-full"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('image', e.target.files?.[0] || null)}
                  />
                  <InputError message={errors.image} className="mt-2" />
                </div>

                <div className="flex items-center justify-end">
                  <Button
                    type="submit"
                    className="ml-4"
                    disabled={processing}
                  >
                    Mettre à jour le produit
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
