import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import AppLayout from '@/layouts/app-layout';

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

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment]>([
    moment().startOf('month'),
    moment().endOf('month'),
  ]);
  const [groupBy, setGroupBy] = useState('day');
  const [type, setType] = useState('all');
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/reports', {
        params: {
          start_date: dateRange[0].format('YYYY-MM-DD'),
          end_date: dateRange[1].format('YYYY-MM-DD'),
          group_by: groupBy,
          type: type,
        },
      });
      setReportData(response.data.report);
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReport();
  }, [dateRange, groupBy, type]);

  return (
    <AppLayout>
    <div className="p-6">
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="mb-6 text-2xl font-bold">Rapports</h2>

        <div className="mb-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Date de début</label>
              <input
                type="date"
                className="p-2 w-full rounded border"
                value={dateRange[0].format('YYYY-MM-DD')}
                onChange={(e) => setDateRange([moment(e.target.value), dateRange[1]])}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Date de fin</label>
              <input
                type="date"
                className="p-2 w-full rounded border"
                value={dateRange[1].format('YYYY-MM-DD')}
                onChange={(e) => setDateRange([dateRange[0], moment(e.target.value)])}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Grouper par</label>
              <select
                className="p-2 w-full rounded border"
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
              >
                <option value="day">Journalier</option>
                <option value="month">Mensuel</option>
                <option value="year">Annuel</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Type</label>
              <select
                className="p-2 w-full rounded border"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="all">Tous</option>
                <option value="sales">Ventes</option>
                <option value="purchases">Achats</option>
              </select>
            </div>
          </div>
        </div>

        {summary && (
          <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3 lg:grid-cols-5">
            <div className="p-4 text-center bg-gray-50 rounded-lg">
              <h3 className="mb-1 text-sm font-medium text-gray-500">Total Ventes</h3>
              <p className="text-xl font-bold">{Number(summary.total_sales).toFixed(2)} €</p>
            </div>
            <div className="p-4 text-center bg-gray-50 rounded-lg">
              <h3 className="mb-1 text-sm font-medium text-gray-500">Total Achats</h3>
              <p className="text-xl font-bold">{Number(summary.total_purchases).toFixed(2)} €</p>
            </div>
            <div className="p-4 text-center bg-gray-50 rounded-lg">
              <h3 className="mb-1 text-sm font-medium text-gray-500">Profit Total</h3>
              <p className="text-xl font-bold">{Number(summary.total_profit).toFixed(2)} €</p>
            </div>
            <div className="p-4 text-center bg-gray-50 rounded-lg">
              <h3 className="mb-1 text-sm font-medium text-gray-500">Qté Ventes</h3>
              <p className="text-xl font-bold">{Number(summary.total_sales_quantity)}</p>
            </div>
            <div className="p-4 text-center bg-gray-50 rounded-lg">
              <h3 className="mb-1 text-sm font-medium text-gray-500">Qté Achats</h3>
              <p className="text-xl font-bold">{Number(summary.total_purchase_quantity)}</p>
            </div>
          </div>
        )}

        <div className="overflow-x-auto mb-6">
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
              {reportData.map((row) => (
                <tr key={row.date}>
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

        <div className="flex gap-4">
          <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200">
            Exporter CSV
          </button>
          <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200">
            Graphique Ligne
          </button>
          <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200">
            Graphique Barres
          </button>
        </div>
      </div>
    </div>
     </AppLayout>
  );
};

export default Reports;
