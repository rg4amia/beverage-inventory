import { Head, Link } from '@inertiajs/react';
import { Product as ProductType } from '@/types';
import { Product } from '@/models/Product';
import AppLayout from '@/layouts/app-layout';
import Pagination from '@/Components/Pagination';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePage } from '@inertiajs/react';

interface Props {
  products: {
    data: ProductType[];
    links: any[];
  };
}

export default function Index({ products }: Props) {
  const { flash } = usePage().props;
  const productInstances = products.data.map(data => new Product(data));

  return (
    <AppLayout>
      <Head title="Produits" />

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
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="flex flex-col gap-4 justify-between items-start mb-8 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Liste des produits</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Gérez votre inventaire de produits
                  </p>
                </div>
                <Link
                  href={route('products.create')}
                  className="inline-flex items-center px-4 py-2 bg-white rounded-md border-2 shadow-sm transition-colors duration-200 text-cave-bordeaux border-cave-bordeaux hover:bg-cave-bordeaux hover:text-white"
                >
                  <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter un produit
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Produit
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Catégorie
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Prix
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Stock
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productInstances.map((product) => (
                      <tr key={product.id} className="transition-colors duration-150 hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {product.image_path ? (
                              <img
                                src={`/storage/${product.image_path}`}
                                alt={product.name}
                                className="object-cover mr-3 w-10 h-10 rounded-full"
                              />
                            ) : (
                              <div className="flex justify-center items-center mr-3 w-10 h-10 bg-gray-100 rounded-full">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.barcode}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {product.category.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.isLowStock()
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {product.stock_quantity}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <Link
                              href={route('products.edit', product.id)}
                              className="text-gray-500 transition-colors hover:text-cave-bordeaux"
                              title="Modifier"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Link>
                            <Link
                              href={route('products.destroy', product.id)}
                              method="delete"
                              as="button"
                              className="text-gray-500 transition-colors hover:text-red-600"
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

              {products.data.length === 0 && (
                <div className="py-12 text-center">
                  <svg className="mx-auto w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun produit</h3>
                  <p className="mt-1 text-sm text-gray-500">Commencez par ajouter un nouveau produit.</p>
                </div>
              )}

              <div className="mt-8">
                <Pagination links={products.links} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
