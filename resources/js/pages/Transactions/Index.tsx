import { Head, Link, usePage } from '@inertiajs/react';
import { Transaction } from '@/types';
import AppLayout from '@/layouts/app-layout';
import Pagination from '@/Components/Pagination';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatCurrency } from '@/utils/currency';

interface Props {
  transactions: {
    data: Transaction[];
    links: any[];
  };
}

interface Flash {
  success?: string;
  error?: string;
}

export default function Index({ transactions }: Props) {
  const { flash } = usePage().props as { flash?: Flash };

  return (
    <AppLayout>
      <Head title="Transactions" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {flash?.success && (
            <Alert className="mb-6">
              <AlertDescription>{flash.success}</AlertDescription>
            </Alert>
          )}
          {flash?.error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{flash.error}</AlertDescription>
            </Alert>
          )}
          <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="flex flex-col gap-4 justify-between items-start mb-8 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">Liste des transactions</h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Gérez vos transactions
                  </p>
                </div>
                <Link
                  href={route('transactions.create')}
                  className="inline-flex items-center px-4 py-2 text-white bg-blue-600 rounded-md border-2 shadow-sm transition-colors duration-200 border-cave-bordeaux hover:bg-cave-bordeaux hover:text-white"
                >
                  <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter une transaction
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-600 dark:text-gray-200 uppercase">
                        Produit
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-600 dark:text-gray-200 uppercase">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-600 dark:text-gray-200 uppercase">
                        Quantité
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-600 dark:text-gray-200 uppercase">
                        Prix unitaire
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-600 dark:text-gray-200 uppercase">
                        Prix total
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-600 dark:text-gray-200 uppercase">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-600 dark:text-gray-200 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {transactions.data.map((transaction) => (
                      <tr key={transaction.id} className="transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{transaction.product.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.type === 'in'
                              ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
                              : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
                          }`}>
                            {transaction.type === 'in' ? 'Entrée' : 'Sortie'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-200">{transaction.quantity}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-200">{formatCurrency(transaction.unit_price)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-200">{formatCurrency(transaction.total_price)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-200">{new Date(transaction.created_at).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <Link
                              href={route('transactions.edit', transaction.id)}
                              className="text-gray-600 dark:text-gray-400 transition-colors hover:text-cave-bordeaux"
                              title="Modifier"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Link>
                            <Link
                              href={route('transactions.destroy', transaction.id)}
                              method="delete"
                              as="button"
                              className="text-gray-600 dark:text-gray-400 transition-colors hover:text-red-400"
                              title="Supprimer"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {transactions.data.length === 0 && (
                <div className="py-12 text-center">
                  <svg className="mx-auto w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">Aucune transaction</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Commencez par ajouter une nouvelle transaction.</p>
                </div>
              )}

              <div className="mt-8">
                <Pagination links={transactions.links} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}