import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import AppLayout from '@/layouts/app-layout';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface Transaction {
    id: number;
    created_at: string;
    product: {
        name: string;
        price: number;
    };
    quantity: number;
    type: string;
    user: {
        name: string;
    };
}

interface Stats {
    total_transactions: number;
    total_quantity: number;
    total_value: number;
    by_type: Record<string, { count: number; quantity: number; value: number }>;
    by_product: Record<string, { name: string; count: number; quantity: number; value: number }>;
    daily_stats: Record<string, { count: number; quantity: number; value: number }>;
}

export default function Reports({ auth }: PageProps) {
    const { data, setData, post, processing } = useForm({
        type: 'daily',
        format: 'pdf',
        start_date: '',
        end_date: '',
    });

    const [previewData, setPreviewData] = useState<{
        transactions: Transaction[];
        stats: Stats;
    } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(route('reports.generate'), data);
            if (response.data.download_url) {
                // Créer un lien temporaire pour le téléchargement
                const link = document.createElement('a');
                link.href = response.data.download_url;
                link.download = response.data.filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error('Error generating report:', error);
        }
    };

    const handlePreview = async () => {
        try {
            const response = await axios.post(route('reports.preview'), {
                start_date: data.start_date,
                end_date: data.end_date,
            });
            setPreviewData(response.data);
        } catch (error) {
            console.error('Error fetching preview:', error);
        }
    };

    const prepareChartData = (data: any) => {
        if (!data) return null;

        // Données pour le graphique des transactions par jour
        const dailyData = {
            labels: Object.keys(data.stats.daily_stats).map(date =>
                format(new Date(date), 'dd/MM', { locale: fr })
            ),
            datasets: [
                {
                    label: 'Nombre de transactions',
                    data: Object.values(data.stats.daily_stats).map(stat => stat.count),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                },
                {
                    label: 'Quantité',
                    data: Object.values(data.stats.daily_stats).map(stat => stat.quantity),
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1,
                }
            ]
        };

        // Données pour le graphique des types de transactions
        const typeData = {
            labels: Object.keys(data.stats.by_type),
            datasets: [{
                data: Object.values(data.stats.by_type).map(stat => stat.count),
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 206, 86)',
                    'rgb(75, 192, 192)',
                ],
            }]
        };

        // Données pour le graphique des produits les plus vendus
        const productData = {
            labels: Object.values(data.stats.by_product).map(stat => stat.name),
            datasets: [{
                label: 'Quantité vendue',
                data: Object.values(data.stats.by_product).map(stat => stat.quantity),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            }]
        };

        return { dailyData, typeData, productData };
    };

    const chartData = previewData ? prepareChartData(previewData) : null;

    return (
        <AppLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Rapports</h2>}
        >
            <Head title="Rapports" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Générer un rapport</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Type de rapport</Label>
                                        <Select
                                            value={data.type}
                                            onValueChange={(value) => setData('type', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner le type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="daily">Journalier</SelectItem>
                                                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                                                <SelectItem value="monthly">Mensuel</SelectItem>
                                                <SelectItem value="yearly">Annuel</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="format">Format</Label>
                                        <Select
                                            value={data.format}
                                            onValueChange={(value) => setData('format', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner le format" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pdf">PDF</SelectItem>
                                                <SelectItem value="xls">Excel</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="start_date">Date de début</Label>
                                        <Input
                                            type="date"
                                            id="start_date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="end_date">Date de fin</Label>
                                        <Input
                                            type="date"
                                            id="end_date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button type="button" onClick={handlePreview}>
                                        Prévisualiser
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        Générer le rapport
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {previewData && (
                        <div className="mt-8 space-y-8">
                            {/* Statistiques générales */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Statistiques générales</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <h3 className="text-sm font-medium text-gray-500">Total des transactions</h3>
                                            <p className="mt-2 text-3xl font-semibold">{previewData.stats.total_transactions}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <h3 className="text-sm font-medium text-gray-500">Quantité totale</h3>
                                            <p className="mt-2 text-3xl font-semibold">{previewData.stats.total_quantity}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <h3 className="text-sm font-medium text-gray-500">Valeur totale</h3>
                                            <p className="mt-2 text-3xl font-semibold">{previewData.stats.total_value.toFixed(2)} F CFA</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Statistiques par type */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Statistiques par type</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Type</th>
                                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Nombre</th>
                                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Quantité</th>
                                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Valeur</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {Object.entries(previewData.stats.by_type).map(([type, stats]) => (
                                                    <tr key={type}>
                                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{type}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{stats.count}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{stats.quantity}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{stats.value.toFixed(2)} F CFA</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Statistiques par produit */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Statistiques par produit</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Produit</th>
                                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Nombre</th>
                                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Quantité</th>
                                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Valeur</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {Object.entries(previewData.stats.by_product).map(([id, stats]) => (
                                                    <tr key={id}>
                                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{stats.name}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{stats.count}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{stats.quantity}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{stats.value.toFixed(2)} F CFA</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Graphiques */}
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                {/* Graphique des transactions par jour */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Évolution des transactions</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {chartData && (
                                            <Line
                                                data={chartData.dailyData}
                                                options={{
                                                    responsive: true,
                                                    plugins: {
                                                        legend: {
                                                            position: 'top' as const,
                                                        },
                                                        title: {
                                                            display: true,
                                                            text: 'Transactions par jour',
                                                        },
                                                    },
                                                }}
                                            />
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Graphique des types de transactions */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Répartition par type</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {chartData && (
                                            <Pie
                                                data={chartData.typeData}
                                                options={{
                                                    responsive: true,
                                                    plugins: {
                                                        legend: {
                                                            position: 'top' as const,
                                                        },
                                                    },
                                                }}
                                            />
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Graphique des produits les plus vendus */}
                                <Card className="md:col-span-2">
                                    <CardHeader>
                                        <CardTitle>Produits les plus vendus</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {chartData && (
                                            <Bar
                                                data={chartData.productData}
                                                options={{
                                                    responsive: true,
                                                    plugins: {
                                                        legend: {
                                                            position: 'top' as const,
                                                        },
                                                    },
                                                }}
                                            />
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Tableau des transactions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Transactions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
                                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Produit</th>
                                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Quantité</th>
                                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Type</th>
                                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Utilisateur</th>
                                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Valeur</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {previewData.transactions.map((transaction) => (
                                                    <tr key={transaction.id}>
                                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                                            {format(new Date(transaction.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{transaction.product.name}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{transaction.quantity}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{transaction.type}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{transaction.user.name}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                                            {(transaction.quantity * transaction.product.price).toFixed(2)} F CFA
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
