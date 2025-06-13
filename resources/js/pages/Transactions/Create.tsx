import { Head, useForm } from '@inertiajs/react';
import { Product } from '@/types';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  type: 'in' | 'out';
  products: Product[];
}

export default function Create({ type, products }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    product_id: '',
    quantity: '',
    unit_price: '',
    notes: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('transactions.store', { type }));
  };

  return (
    <AppLayout>
      <Head title={type === 'in' ? 'Entrée de stock' : 'Sortie de stock'} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h2 className="mb-6 text-2xl font-semibold text-cave-bordeaux">
                {type === 'in' ? 'Nouvelle entrée de stock' : 'Nouvelle sortie de stock'}
              </h2>

              <form onSubmit={submit} className="space-y-6">
                <div>
                  <Label htmlFor="product_id">Produit</Label>
                  <Select
                    value={data.product_id}
                    onValueChange={(value) => setData('product_id', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionnez un produit" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name} - Stock actuel: {product.stock_quantity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <InputError message={errors.product_id} className="mt-2" />
                </div>

                <div>
                  <Label htmlFor="quantity">Quantité</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    className="block mt-1 w-full"
                    value={data.quantity}
                    onChange={(e) => setData('quantity', e.target.value)}
                    required
                  />
                  <InputError message={errors.quantity} className="mt-2" />
                </div>

                <div>
                  <Label htmlFor="unit_price">Prix unitaire</Label>
                  <Input
                    id="unit_price"
                    type="number"
                    step="0.01"
                    min="0"
                    className="block mt-1 w-full"
                    value={data.unit_price}
                    onChange={(e) => setData('unit_price', e.target.value)}
                    required
                  />
                  <InputError message={errors.unit_price} className="mt-2" />
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <textarea
                    id="notes"
                    className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-cave-bordeaux focus:ring-cave-bordeaux"
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    rows={3}
                  />
                  <InputError message={errors.notes} className="mt-2" />
                </div>

                <div className="flex justify-end items-center">
                  <Button
                    type="submit"
                    className="ml-4"
                    disabled={processing}
                  >
                    {type === 'in' ? 'Enregistrer l\'entrée' : 'Enregistrer la sortie'}
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
