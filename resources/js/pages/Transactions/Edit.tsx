import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product, Transaction } from '@/types';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { formatCurrency } from '@/utils/currency';

interface Props {
  transaction: Transaction;
  products: Product[];
}

export default function Edit({ transaction, products }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, setData, put, processing, errors } = useForm({
    product_id: transaction.product_id.toString(),
    quantity: transaction.quantity.toString(),
    unit_price: transaction.unit_price.toString(),
    purchase_price: transaction.purchase_price?.toString() || '',
    sale_price: transaction.sale_price?.toString() || '',
    notes: transaction.notes || '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('transactions.update', transaction.id), {
      onSuccess: () => {
        // Optionnel : Ajouter un message de succès ou une redirection personnalisée
      },
      onError: (errors) => {
        // Optionnel : Gérer les erreurs spécifiques
        console.error('Erreur lors de la mise à jour de la transaction:', errors);
      }
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductSelect = (value: string) => {
    const product = products.find(p => p.id.toString() === value);
    setData('product_id', value);
    if (product) {
      setData('purchase_price', product.purchase_price?.toString() || '');
      setData('sale_price', product.sale_price?.toString() || '');
      // Définir le prix unitaire en fonction du type de transaction
      if (transaction.type === 'in') {
        setData('unit_price', product.purchase_price?.toString() || '');
      } else {
        setData('unit_price', product.sale_price?.toString() || '');
      }
    }
  };

  return (
    <AppLayout>
      <Head title="Modifier la transaction" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-cave-bordeaux">Modifier la transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-6">
                <div>
                  <Label htmlFor="product" className="text-gray-700 dark:text-gray-200">Produit</Label>
                  <Select
                    value={data.product_id}
                    onValueChange={handleProductSelect}
                  >
                    <SelectTrigger className="w-full text-gray-900 bg-white border-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue placeholder="Sélectionner un produit" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600">
                      <div className="sticky top-0 z-10 p-2 bg-white dark:bg-gray-700">
                        <Input
                          type="text"
                          placeholder="Rechercher un produit..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full text-gray-900 bg-white border-gray-300 dark:text-gray-200 dark:bg-gray-600 dark:border-gray-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      {filteredProducts.map((product) => (
                        <SelectItem
                          key={product.id}
                          value={product.id.toString()}
                          className="text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          {product.name} - Stock actuel: {product.stock_quantity}
                          {transaction.type === 'in' && product.purchase_price && ` (Prix d'achat: ${formatCurrency(product.purchase_price)})`}
                          {transaction.type === 'out' && product.sale_price && ` (Prix de vente: ${formatCurrency(product.sale_price)})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <InputError message={errors.product_id} className="mt-2" />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <Label htmlFor="quantity" className="text-gray-700 dark:text-gray-200">Quantité</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      className="block mt-1 w-full text-gray-900 bg-white border-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                      value={data.quantity}
                      onChange={(e) => setData('quantity', e.target.value)}
                      required
                    />
                    <InputError message={errors.quantity} className="mt-2" />
                  </div>

                  <div>
                    <Label htmlFor="purchase_price" className="text-gray-700 dark:text-gray-200">Prix d'achat</Label>
                    <Input
                      id="purchase_price"
                      type="number"
                      step="0.01"
                      min="0"
                      className="block mt-1 w-full text-gray-900 bg-white border-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                      value={data.purchase_price}
                      onChange={(e) => setData('purchase_price', e.target.value)}
                      required
                    />
                    <InputError message={errors.purchase_price} className="mt-2" />
                  </div>

                  <div>
                    <Label htmlFor="sale_price" className="text-gray-700 dark:text-gray-200">Prix de vente</Label>
                    <Input
                      id="sale_price"
                      type="number"
                      step="0.01"
                      min="0"
                      className="block mt-1 w-full text-gray-900 bg-white border-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                      value={data.sale_price}
                      onChange={(e) => setData('sale_price', e.target.value)}
                      required
                    />
                    <InputError message={errors.sale_price} className="mt-2" />
                  </div>

                  <div>
                    <Label htmlFor="unit_price" className="text-gray-700 dark:text-gray-200">
                      {transaction.type === 'in' ? 'Prix d\'achat unitaire' : 'Prix de vente unitaire'}
                    </Label>
                    <Input
                      id="unit_price"
                      type="number"
                      step="0.01"
                      min="0"
                      className="block mt-1 w-full text-gray-900 bg-white border-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                      value={data.unit_price}
                      onChange={(e) => setData('unit_price', e.target.value)}
                      required
                    />
                    <InputError message={errors.unit_price} className="mt-2" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="text-gray-700 dark:text-gray-200">Notes</Label>
                  <textarea
                    id="notes"
                    className="block mt-1 w-full text-gray-900 bg-white rounded-md border-gray-300 shadow-sm dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:border-cave-bordeaux focus:ring-cave-bordeaux"
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
                    Mettre à jour la transaction
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