import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
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
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface ReportData {
    date: string;
    sales_quantity: number;
    purchase_quantity: number;
    sales_amount: number;
    purchase_amount: number;
    profit: number;
}

interface Summary {
    total_sales: number;
    total_purchases: number;
    total_profit: number;
    total_sales_quantity: number;
    total_purchase_quantity: number;
}

export default function Reports({ auth }: PageProps) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [groupBy, setGroupBy] = useState('day');
    const [type, setType] = useState('all');
    const [report, setReport] = useState<ReportData[]>([]);
    const [summary, setSummary] = useState<Summary>({
        total_sales: 0,
        total_purchases: 0,
        total_profit: 0,
        total_sales_quantity: 0,
        total_purchase_quantity: 0,
    });
    const [loading, setLoading] = useState(false);
    const [filterChanged, setFilterChanged] = useState(false);
    const [showCharts, setShowCharts] = useState(false);

    useEffect(() => {
        if (!filterChanged) {
            fetchReport();
        }
    }, [startDate, endDate, groupBy, type]);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/reports', {
                params: {
                    start_date: startDate,
                    end_date: endDate,
                    group_by: groupBy,
                    type: type,
                },
            });
            setReport(response.data.report);
            setSummary(response.data.summary);
            setFilterChanged(false);
        } catch (error) {
            console.error('Error fetching report:', error);
        }
        setLoading(false);
    };

    const handleFilterChange = () => {
        setFilterChanged(true);
    };

    const handleExport = async (format: 'csv' | 'xlsx') => {
        try {
            const response = await axios.get('/api/reports/export', {
                params: {
                    start_date: startDate,
                    end_date: endDate,
                    group_by: groupBy,
                    type: type,
                    format: format,
                },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `rapport_${startDate}_${endDate}.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting report:', error);
        }
    };

    const chartData = {
        labels: report.map(item => item.date),
        datasets: [
            {
                label: 'Ventes (€)',
                data: report.map(item => Number(item.sales_amount)),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
            {
                label: 'Achats (€)',
                data: report.map(item => Number(item.purchase_amount)),
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1,
            },
            {
                label: 'Profit (€)',
                data: report.map(item => Number(item.profit)),
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.1,
            },
        ],
    };

    const barData = {
        labels: report.map(item => item.date),
        datasets: [
            {
                label: 'Ventes (Qté)',
                data: report.map(item => Number(item.sales_quantity)),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
            {
                label: 'Achats (Qté)',
                data: report.map(item => Number(item.purchase_quantity)),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Évolution des ventes, achats et profits',
            },
        },
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Quantités de ventes et d\'achats',
            },
        },
    };

    return (
        <AppLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Rapports</h2>}
        >
            <Head title="Rapports" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date de début</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => {
                                            setStartDate(e.target.value);
                                            handleFilterChange();
                                        }}
                                        className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => {
                                            setEndDate(e.target.value);
                                            handleFilterChange();
                                        }}
                                        className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Grouper par</label>
                                    <select
                                        value={groupBy}
                                        onChange={(e) => {
                                            setGroupBy(e.target.value);
                                            handleFilterChange();
                                        }}
                                        className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="day">Jour</option>
                                        <option value="month">Mois</option>
                                        <option value="year">Année</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Type</label>
                                    <select
                                        value={type}
                                        onChange={(e) => {
                                            setType(e.target.value);
                                            handleFilterChange();
                                        }}
                                        className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="all">Tous</option>
                                        <option value="sale">Ventes</option>
                                        <option value="purchase">Achats</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-between mb-6">
                                <button
                                    onClick={fetchReport}
                                    disabled={!filterChanged}
                                    className={`px-4 py-2 rounded-md text-white ${
                                        filterChanged
                                            ? 'bg-indigo-600 hover:bg-indigo-700'
                                            : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    {loading ? 'Chargement...' : 'Valider les filtres'}
                                </button>

                                <div className="space-x-4">
                                    <button
                                        onClick={() => handleExport('csv')}
                                        className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                                    >
                                        Exporter CSV
                                    </button>
                                    <button
                                        onClick={() => handleExport('xlsx')}
                                        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                    >
                                        Exporter XLSX
                                    </button>
                                    <button
                                        onClick={() => setShowCharts(!showCharts)}
                                        className="px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700"
                                    >
                                        {showCharts ? 'Masquer les graphiques' : 'Afficher les graphiques'}
                                    </button>
                                </div>
                            </div>

                            {showCharts && (
                                <div className="grid grid-cols-1 gap-6 mb-6">
                                    <div className="p-4 bg-white rounded-lg shadow">
                                        <Line data={chartData} options={chartOptions} />
                                    </div>
                                    <div className="p-4 bg-white rounded-lg shadow">
                                        <Bar data={barData} options={barOptions} />
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-5">
                                <div className="p-4 bg-white rounded-lg shadow">
                                    <h3 className="text-lg font-semibold text-gray-700">Total Ventes</h3>
                                    <p className="text-2xl font-bold text-green-600">{Number(summary.total_sales).toFixed(2)} €</p>
                                </div>
                                <div className="p-4 bg-white rounded-lg shadow">
                                    <h3 className="text-lg font-semibold text-gray-700">Total Achats</h3>
                                    <p className="text-2xl font-bold text-red-600">{Number(summary.total_purchases).toFixed(2)} €</p>
                                </div>
                                <div className="p-4 bg-white rounded-lg shadow">
                                    <h3 className="text-lg font-semibold text-gray-700">Profit Total</h3>
                                    <p className="text-2xl font-bold text-blue-600">{Number(summary.total_profit).toFixed(2)} €</p>
                                </div>
                                <div className="p-4 bg-white rounded-lg shadow">
                                    <h3 className="text-lg font-semibold text-gray-700">Qté Ventes</h3>
                                    <p className="text-2xl font-bold text-green-600">{Number(summary.total_sales_quantity)}</p>
                                </div>
                                <div className="p-4 bg-white rounded-lg shadow">
                                    <h3 className="text-lg font-semibold text-gray-700">Qté Achats</h3>
                                    <p className="text-2xl font-bold text-red-600">{Number(summary.total_purchase_quantity)}</p>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Ventes (Qté)</th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Achats (Qté)</th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Ventes (€)</th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Achats (€)</th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Profit (€)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {report.map((row, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{row.date}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{Number(row.sales_quantity)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{Number(row.purchase_quantity)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{Number(row.sales_amount).toFixed(2)} €</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{Number(row.purchase_amount).toFixed(2)} €</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{Number(row.profit).toFixed(2)} €</td>
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
