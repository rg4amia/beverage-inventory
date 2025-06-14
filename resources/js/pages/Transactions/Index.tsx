import { Head, Link } from '@inertiajs/react';
import { Transaction } from '@/types';
import AppLayout from '@/layouts/app-layout';
import Pagination from '@/Components/Pagination';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePage } from '@inertiajs/react';

interface Props {
  transactions: {
    data: Transaction[];
    links: any[];
  };
}

export default function Index({ transactions }: Props) {
  const { flash } = usePage().props;

  return (
    <AppLayout>
      <Head title="Transactions" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {flash.success && (
            <Alert className="mb-6">
              <AlertDescription>{flash.success}</AlertDescription>
            </Alert>
          )}
          {flash.error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{flash.error}</AlertDescription>
            </Alert>
          )}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-200">Liste des transactions</CardTitle>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Gérez vos transactions de stock
                  </p>
                </div>
                <div className="flex space-x-4">
                  <Link
                    href={route('transactions.create', { type: 'in' })}
                    className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-green-600 border-2 border-green-600 rounded-md hover:bg-green-600 hover:text-white transition-colors duration-200 shadow-sm"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Entrée de stock
                  </Link>
                  <Link
                    href={route('transactions.create', { type: 'out' })}
                    className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-red-600 border-2 border-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors duration-200 shadow-sm"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    </svg>
                    Sortie de stock
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {transactions.data.map((transaction) => (
                  <Card key={transaction.id} className="hover:shadow-md transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">{transaction.product.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            href={route('transactions.edit', transaction.id)}
                            className="p-1 text-gray-500 dark:text-gray-400 hover:text-cave-bordeaux transition-colors"
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
                            className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-400 transition-colors"
                            title="Supprimer"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === 'in'
                            ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
                        }`}>
                          {transaction.type === 'in' ? 'Entrée' : 'Sortie'}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                          {transaction.quantity} unités
                        </span>
                      </div>
                      {transaction.notes && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {transaction.notes}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {transactions.data.length === 0 && (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">Aucune transaction</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Commencez par créer une nouvelle transaction.</p>
                </div>
              )}

              <div className="mt-8">
                <Pagination links={transactions.links} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}