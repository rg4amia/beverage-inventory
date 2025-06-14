import { Head, Link } from '@inertiajs/react';
import { Category } from '@/types';
import AppLayout from '@/layouts/app-layout';
import Pagination from '@/Components/Pagination';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePage } from '@inertiajs/react';

interface Props {
  categories: {
    data: Category[];
    links: any[];
  };
}

export default function Index({ categories }: Props) {
  const { flash } = usePage().props;

  return (
    <AppLayout>
      <Head title="Catégories" />

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
          <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">Liste des catégories</h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Gérez vos catégories de produits
                  </p>
                </div>
                <Link
                  href={route('categories.create')}
                  className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-cave-bordeaux border-2 border-cave-bordeaux rounded-md hover:bg-cave-bordeaux hover:text-white transition-colors duration-200 shadow-sm"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter une catégorie
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categories.data.map((category) => (
                  <div
                    key={category.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">{category.name}</h3>
                        <div className="flex space-x-2">
                          <Link
                            href={route('categories.edit', category.id)}
                            className="p-1 text-gray-500 dark:text-gray-400 hover:text-cave-bordeaux transition-colors"
                            title="Modifier"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <Link
                            href={route('categories.destroy', category.id)}
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
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{category.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                          {category.products_count} produits
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {categories.data.length === 0 && (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">Aucune catégorie</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Commencez par créer une nouvelle catégorie.</p>
                </div>
              )}

              <div className="mt-8">
                <Pagination links={categories.links} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
