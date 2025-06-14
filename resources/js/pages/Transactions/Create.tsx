import { Head, useForm } from '@inertiajs/react';
import { Product } from '@/types';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface Props {
  type: 'in' | 'out';
  products: Product[];
}

export default function Create({ type, products }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, setData, post, processing, errors } = useForm({
    product_id: '',
    quantity: '',
    unit_price: '',
    notes: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('transactions.store', { type }), {
      onSuccess: () => {
        // Optionnel : Ajouter un message de succès ou une redirection personnalisée
      },
      onError: (errors) => {
        // Optionnel : Gérer les erreurs spécifiques
        console.error('Erreur lors de la création de la transaction:', errors);
      }
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <Head title={type === 'in' ? 'Entrée de stock' : 'Sortie de stock'} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-gray-800 shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h2 className="mb-6 text-2xl font-semibold text-cave-bordeaux">
                {type === 'in' ? 'Nouvelle entrée de stock' : 'Nouvelle sortie de stock'}
              </h2>

              <form onSubmit={submit} className="space-y-6">
                <div>
                  <Label htmlFor="product_id" className="text-gray-200">Produit</Label>
                  <Select
                    value={data.product_id}
                    onValueChange={(value) => {
                      const product = products.find(p => p.id.toString() === value);
                      setData('product_id', value);
                      if (product) {
                        setData('unit_price', product.price.toString());
                      }
                    }}
                  >
                    <SelectTrigger className="w-full text-gray-200 bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Sélectionnez un produit" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <div className="sticky top-0 z-10 p-2 bg-gray-700">
                        <Input
                          type="text"
                          placeholder="Rechercher un produit..."
                          className="w-full text-gray-200 bg-gray-600 border-gray-500"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      {filteredProducts.length === 0 ? (
                        <div className="p-2 text-center text-gray-400">Aucun produit trouvé</div>
                      ) : (
                        filteredProducts.map((product) => (
                          <SelectItem key={product.id} value={product.id.toString()} className="text-gray-200 hover:bg-gray-600">
                            {product.name} - Stock actuel: {product.stock_quantity}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <InputError message={errors.product_id} className="mt-2" />
                </div>

                <div>
                  <Label htmlFor="quantity" className="text-gray-200">Quantité</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    className="block mt-1 w-full text-gray-200 bg-gray-700 border-gray-600"
                    value={data.quantity}
                    onChange={(e) => setData('quantity', e.target.value)}
                    required
                  />
                  <InputError message={errors.quantity} className="mt-2" />
                </div>

                <div>
                  <Label htmlFor="unit_price" className="text-gray-200">Prix unitaire</Label>
                  <Input
                    id="unit_price"
                    type="number"
                    step="0.01"
                    min="0"
                    className="block mt-1 w-full text-gray-200 bg-gray-700 border-gray-600"
                    value={data.unit_price}
                    onChange={(e) => setData('unit_price', e.target.value)}
                    required
                  />
                  <InputError message={errors.unit_price} className="mt-2" />
                </div>

                <div>
                  <Label htmlFor="notes" className="text-gray-200">Notes</Label>
                  <textarea
                    id="notes"
                    className="block mt-1 w-full text-gray-200 bg-gray-700 rounded-md border-gray-600 shadow-sm focus:border-cave-bordeaux focus:ring-cave-bordeaux"
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
