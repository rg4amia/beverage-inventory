import { Head, Link, router } from '@inertiajs/react';
import { Product } from '@/types';
import AppLayout from '@/layouts/app-layout';
import Pagination from '@/Components/Pagination';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePage } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PageProps {
  flash: {
    success?: string;
    error?: string;
  };
  categories: Array<{
    id: number;
    name: string;
  }>;
  [key: string]: unknown;
}

interface Props {
  products: {
    data: Product[];
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
  };
  filters: {
    search?: string;
    category?: string | string[];
  };
}

export default function Index({ products, filters }: Props) {
  const { flash, categories } = usePage<PageProps>().props;
  const [searchParams, setSearchParams] = useState({
    search: filters.search || '',
    category: filters.category || []
  });

  const debouncedSearch = debounce((value: string) => {
    setSearchParams(prev => ({ ...prev, search: value }));
  }, 300);

  const handleCategoryChange = (value: string) => {
    setSearchParams(prev => ({
      ...prev,
      category: value === 'all' ? [] : [value]
    }));
  };

  useEffect(() => {
    router.get(
      route('products.index'),
      searchParams,
      { preserveState: true, preserveScroll: true }
    );
  }, [searchParams]);

  const handleReset = () => {
    setSearchParams({
      search: '',
      category: []
    });
  };

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
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 justify-between items-start sm:flex-row sm:items-center">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-200">Liste des produits</CardTitle>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Gérez vos produits
                  </p>
                </div>
                <Link
                  href={route('products.create')}
                  className="inline-flex items-center px-4 py-2 bg-white rounded-md border-2 shadow-sm transition-colors duration-200 dark:bg-gray-800 text-cave-bordeaux border-cave-bordeaux hover:bg-cave-bordeaux hover:text-white"
                >
                  <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter un produit
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Input
                    type="text"
                    placeholder="Rechercher un produit..."
                    defaultValue={searchParams.search}
                    onChange={(e) => debouncedSearch(e.target.value)}
                    className="w-full"
                  />
                  <div className="space-y-2">
                    <Select
                      value={Array.isArray(searchParams.category) && searchParams.category.length > 0 ? searchParams.category[0] : 'all'}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {products.data.map((product) => (
                  <Card key={product.id} className="transition-all duration-200 hover:shadow-md dark:bg-gray-800/50">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-1/3">
                          <img
                            src={product.image_path || 'https://via.placeholder.com/150?text=No+Image'}
                            alt={product.name}
                            className="object-contain w-full h-32 bg-gray-100 rounded-md dark:bg-gray-700"
                          />
                        </div>
                        <div className="space-y-2 w-2/3">
                          <div className="flex justify-between items-start">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{product.name}</h3>
                            <div className="flex space-x-1">
                              <Link
                                href={route('products.edit', product.id)}
                                className="p-1 text-gray-500 transition-colors dark:text-gray-400 hover:text-cave-bordeaux dark:hover:text-cave-bordeaux/80"
                                title="Modifier"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </Link>
                              <Link
                                href={route('products.destroy', product.id)}
                                method="delete"
                                as="button"
                                className="p-1 text-gray-500 transition-colors dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                                title="Supprimer"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </Link>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{product.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                              {product.stock_quantity} en stock
                            </span>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {product.price} F CFA
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {products.data.length === 0 && (
                <div className="py-12 text-center">
                  <svg className="mx-auto w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Aucun produit</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Commencez par créer un nouveau produit.</p>
                </div>
              )}

              <div className="mt-8">
                <Pagination links={products.links} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}