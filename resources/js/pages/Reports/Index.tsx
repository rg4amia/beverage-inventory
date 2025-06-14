import React, { useState } from 'react';
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
import { formatCurrency } from '@/utils/currency';

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
    const [showCharts, setShowCharts] = useState(false);

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
        } catch (error) {
            console.error('Error fetching report:', error);
        }
        setLoading(false);
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
                    <div className="overflow-hidden bg-gray-800 shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-200">
                            <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Date de début</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => {
                                            setStartDate(e.target.value);
                                            fetchReport();
                                        }}
                                        className="block mt-1 w-full text-gray-200 bg-gray-700 rounded-md border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Date de fin</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => {
                                            setEndDate(e.target.value);
                                            fetchReport();
                                        }}
                                        className="block mt-1 w-full text-gray-200 bg-gray-700 rounded-md border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Grouper par</label>
                                    <select
                                        value={groupBy}
                                        onChange={(e) => {
                                            setGroupBy(e.target.value);
                                            fetchReport();
                                        }}
                                        className="block mt-1 w-full text-gray-200 bg-gray-700 rounded-md border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="day">Jour</option>
                                        <option value="month">Mois</option>
                                        <option value="year">Année</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Type</label>
                                    <select
                                        value={type}
                                        onChange={(e) => {
                                            setType(e.target.value);
                                            fetchReport();
                                        }}
                                        className="block mt-1 w-full text-gray-200 bg-gray-700 rounded-md border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="all">Tous</option>
                                        <option value="sale">Ventes</option>
                                        <option value="purchase">Achats</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end mb-6 space-x-4">
                                <button
                                    onClick={() => handleExport('csv')}
                                    className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 rounded-md border border-gray-600 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Exporter CSV
                                </button>
                                <button
                                    onClick={() => handleExport('xlsx')}
                                    className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 rounded-md border border-gray-600 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Exporter Excel
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
                                <div className="p-4 bg-gray-700 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-200">Total Ventes</h3>
                                    <p className="text-2xl font-bold text-green-400">{formatCurrency(summary.total_sales)}</p>
                                </div>
                                <div className="p-4 bg-gray-700 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-200">Total Achats</h3>
                                    <p className="text-2xl font-bold text-red-400">{formatCurrency(summary.total_purchases)}</p>
                                </div>
                                <div className="p-4 bg-gray-700 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-200">Profit Total</h3>
                                    <p className="text-2xl font-bold text-blue-400">{formatCurrency(summary.total_profit)}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <button
                                    onClick={() => setShowCharts(!showCharts)}
                                    className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 rounded-md border border-gray-600 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {showCharts ? 'Masquer les graphiques' : 'Afficher les graphiques'}
                                </button>
                            </div>

                            {showCharts && (
                                <div className="space-y-6">
                                    <div className="p-4 bg-gray-700 rounded-lg">
                                        <Line data={chartData} options={chartOptions} />
                                    </div>
                                    <div className="p-4 bg-gray-700 rounded-lg">
                                        <Bar data={barData} options={barOptions} />
                                    </div>
                                </div>
                            )}

                            <div className="overflow-x-auto mt-6">
                                <table className="min-w-full divide-y divide-gray-600">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">Date</th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">Ventes (Qté)</th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">Achats (Qté)</th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">Ventes (€)</th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">Achats (€)</th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">Profit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                                        {report.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-700">
                                                <td className="px-6 py-4 text-sm text-gray-200 whitespace-nowrap">{item.date}</td>
                                                <td className="px-6 py-4 text-sm text-gray-200 whitespace-nowrap">{item.sales_quantity}</td>
                                                <td className="px-6 py-4 text-sm text-gray-200 whitespace-nowrap">{item.purchase_quantity}</td>
                                                <td className="px-6 py-4 text-sm text-green-400 whitespace-nowrap">{formatCurrency(item.sales_amount)}</td>
                                                <td className="px-6 py-4 text-sm text-red-400 whitespace-nowrap">{formatCurrency(item.purchase_amount)}</td>
                                                <td className="px-6 py-4 text-sm text-blue-400 whitespace-nowrap">{formatCurrency(item.profit)}</td>
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
