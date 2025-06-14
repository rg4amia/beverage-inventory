import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Product } from '@/types';
import { Link } from '@inertiajs/react';
import { formatCurrency } from '@/utils/currency';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props {
    lowStockProducts: Product[];
    totalProducts: number;
    totalValue: number;
    recentTransactions: {
        id: number;
        type: 'in' | 'out';
        quantity: number;
        product: {
            name: string;
        };
        created_at: string;
        purchase_price: number;
        sale_price: number;
    }[];
    transactionStats: {
        total: number;
        in: number;
        out: number;
        today: number;
        this_week: number;
        this_month: number;
    };
    financialStats: {
        total_purchases: number;
        total_sales: number;
        total_profit: number;
        monthly_sales: number;
        monthly_profit: number;
    };
    topProducts: {
        product: {
            name: string;
        };
        total_quantity: number;
        total_sales: number;
        total_profit: number;
    }[];
    stockByCategory: {
        name: string;
        products_sum_stock_quantity: number;
    }[];
    valueByCategory: {
        name: string;
        products_sum_price: number;
    }[];
    stockAlerts: {
        total: number;
        critical: number;
        warning: number;
    };
}

export default function Dashboard({
    lowStockProducts,
    totalProducts,
    totalValue,
    recentTransactions,
    transactionStats,
    financialStats,
    topProducts,
    stockByCategory,
    valueByCategory,
    stockAlerts,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tableau de bord" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Statistiques générales */}
                    <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-4">
                        <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total des produits</h3>
                            <p className="mt-2 text-3xl font-bold text-cave-bordeaux">{totalProducts}</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Valeur totale</h3>
                            <p className="mt-2 text-3xl font-bold text-cave-bordeaux">
                                {formatCurrency(totalValue)}
                            </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Ventes du mois</h3>
                            <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(financialStats.monthly_sales)}
                            </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Bénéfice du mois</h3>
                            <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(financialStats.monthly_profit)}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
                        {/* Statistiques financières */}
                        <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="mb-4 text-lg font-semibold text-cave-bordeaux">Statistiques financières</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-700">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Total des achats</p>
                                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                            {formatCurrency(financialStats.total_purchases)}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-700">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Total des ventes</p>
                                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            {formatCurrency(financialStats.total_sales)}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-700">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Bénéfice total</p>
                                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            {formatCurrency(financialStats.total_profit)}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-700">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Marge moyenne</p>
                                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            {((financialStats.total_profit / financialStats.total_sales) * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Produits les plus vendus */}
                        <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="mb-4 text-lg font-semibold text-cave-bordeaux">Produits les plus vendus</h3>
                                <div className="space-y-4">
                                    {topProducts.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg dark:bg-gray-700">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-gray-200">{item.product.name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Quantité: {item.total_quantity}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                                    {formatCurrency(item.total_sales || 0)}
                                                </p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    Bénéfice: {formatCurrency(item.total_profit || 0)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
                        {/* Stocks par catégorie */}
                        <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="mb-4 text-lg font-semibold text-cave-bordeaux">Stocks par catégorie</h3>
                                <div className="space-y-4">
                                    {stockByCategory.map((category, index) => (
                                        <div key={index} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg dark:bg-gray-700">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-gray-200">{category.name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Quantité: {category.products_sum_stock_quantity}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-cave-bordeaux">
                                                    {formatCurrency(valueByCategory[index]?.products_sum_price)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Alertes de stock */}
                        <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="mb-4 text-lg font-semibold text-cave-bordeaux">Alertes de stock</h3>
                                {lowStockProducts.length > 0 ? (
                                    <div className="space-y-4">
                                        {lowStockProducts.map((product) => (
                                            <div
                                                key={product.id}
                                                className="p-4 bg-red-50 rounded-lg border border-red-200 dark:bg-red-900/50 dark:border-red-800"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium text-red-700 dark:text-red-300">{product.name}</p>
                                                        <p className="text-sm text-red-600 dark:text-red-400">
                                                            Stock actuel: {product.stock_quantity} (Minimum: {product.minimum_stock})
                                                        </p>
                                                    </div>
                                                    <Link
                                                        href={route('products.edit', product.id)}
                                                        className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                                                    >
                                                        Gérer
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600 dark:text-gray-400">Aucune alerte de stock</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Transactions récentes */}
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="mb-4 text-lg font-semibold text-cave-bordeaux">
                                Transactions récentes
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-600 uppercase dark:text-gray-400">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-600 uppercase dark:text-gray-400">
                                                Produit
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-600 uppercase dark:text-gray-400">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-600 uppercase dark:text-gray-400">
                                                Quantité
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-600 uppercase dark:text-gray-400">
                                                Prix
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-600 uppercase dark:text-gray-400">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                        {recentTransactions.map((transaction) => (
                                            <tr key={transaction.id}>
                                                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap dark:text-gray-400">
                                                    {new Date(transaction.created_at).toLocaleDateString('fr-FR')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                                        {transaction.product.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            transaction.type === 'in'
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                                                : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                                                        }`}
                                                    >
                                                        {transaction.type === 'in' ? 'Entrée' : 'Sortie'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap dark:text-gray-400">
                                                    {transaction.quantity}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap dark:text-gray-400">
                                                    {transaction.type === 'in'
                                                        ? formatCurrency(transaction.purchase_price)
                                                        : formatCurrency(transaction.sale_price)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap dark:text-gray-400">
                                                    {transaction.type === 'in'
                                                        ? formatCurrency(transaction.purchase_price * transaction.quantity)
                                                        : formatCurrency(transaction.sale_price * transaction.quantity)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
