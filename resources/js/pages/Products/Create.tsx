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

interface Props {
  categories: Category[];
}

export default function Create({ categories }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
  });

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
                  <Label htmlFor="stock" className="text-gray-700 dark:text-gray-200">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    name="stock"
                    value={data.stock}
                    className="block mt-1 w-full text-gray-900 bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('stock', e.target.value)}
                    required
                    min="0"
                  />
                  <InputError message={errors.stock} className="mt-2" />
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
