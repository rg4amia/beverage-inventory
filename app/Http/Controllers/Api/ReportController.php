<?php

namespace App\Http\Controllers\Api;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Http\Controllers\Controller;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Writer\Csv;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $groupBy = $request->input('group_by', 'day');
        $type = $request->input('type', 'all');

        $query = DB::table('transactions')
            ->select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as date"),
                DB::raw('SUM(CASE WHEN type = "sale" THEN quantity ELSE 0 END) as sales_quantity'),
                DB::raw('SUM(CASE WHEN type = "purchase" THEN quantity ELSE 0 END) as purchase_quantity'),
                DB::raw('SUM(CASE WHEN type = "sale" THEN quantity * unit_price ELSE 0 END) as sales_amount'),
                DB::raw('SUM(CASE WHEN type = "purchase" THEN quantity * unit_price ELSE 0 END) as purchase_amount'),
                DB::raw('SUM(CASE WHEN type = "sale" THEN quantity * unit_price ELSE -(quantity * unit_price) END) as profit')
            )
            ->whereBetween('created_at', [$startDate, $endDate]);

        if ($type !== 'all') {
            $query->where('type', $type);
        }

        $query->groupBy('date')
            ->orderBy('date');

        $report = $query->get();

        $summary = [
            'total_sales' => $report->sum('sales_amount'),
            'total_purchases' => $report->sum('purchase_amount'),
            'total_profit' => $report->sum('profit'),
            'total_sales_quantity' => $report->sum('sales_quantity'),
            'total_purchase_quantity' => $report->sum('purchase_quantity'),
        ];

        return response()->json([
            'report' => $report,
            'summary' => $summary
        ]);
    }

    public function export(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $groupBy = $request->input('group_by', 'day');
        $type = $request->input('type', 'all');
        $format = $request->input('format', 'csv');

        $query = DB::table('transactions')
            ->select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as date"),
                DB::raw('SUM(CASE WHEN type = "sale" THEN quantity ELSE 0 END) as sales_quantity'),
                DB::raw('SUM(CASE WHEN type = "purchase" THEN quantity ELSE 0 END) as purchase_quantity'),
                DB::raw('SUM(CASE WHEN type = "sale" THEN quantity * unit_price ELSE 0 END) as sales_amount'),
                DB::raw('SUM(CASE WHEN type = "purchase" THEN quantity * unit_price ELSE 0 END) as purchase_amount'),
                DB::raw('SUM(CASE WHEN type = "sale" THEN quantity * unit_price ELSE -(quantity * unit_price) END) as profit')
            )
            ->whereBetween('created_at', [$startDate, $endDate]);

        if ($type !== 'all') {
            $query->where('type', $type);
        }

        $query->groupBy('date')
            ->orderBy('date');

        $data = $query->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Headers
        $sheet->setCellValue('A1', 'Date');
        $sheet->setCellValue('B1', 'Ventes (Qté)');
        $sheet->setCellValue('C1', 'Achats (Qté)');
        $sheet->setCellValue('D1', 'Ventes (€)');
        $sheet->setCellValue('E1', 'Achats (€)');
        $sheet->setCellValue('F1', 'Profit (€)');

        // Data
        $row = 2;
        foreach ($data as $item) {
            $sheet->setCellValue('A' . $row, $item->date);
            $sheet->setCellValue('B' . $row, $item->sales_quantity);
            $sheet->setCellValue('C' . $row, $item->purchase_quantity);
            $sheet->setCellValue('D' . $row, $item->sales_amount);
            $sheet->setCellValue('E' . $row, $item->purchase_amount);
            $sheet->setCellValue('F' . $row, $item->profit);
            $row++;
        }

        // Summary
        $row += 2;
        $sheet->setCellValue('A' . $row, 'Total');
        $sheet->setCellValue('B' . $row, $data->sum('sales_quantity'));
        $sheet->setCellValue('C' . $row, $data->sum('purchase_quantity'));
        $sheet->setCellValue('D' . $row, $data->sum('sales_amount'));
        $sheet->setCellValue('E' . $row, $data->sum('purchase_amount'));
        $sheet->setCellValue('F' . $row, $data->sum('profit'));

        if ($format === 'xlsx') {
            $writer = new Xlsx($spreadsheet);
            $contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            $extension = 'xlsx';
        } else {
            $writer = new Csv($spreadsheet);
            $contentType = 'text/csv';
            $extension = 'csv';
        }

        $filename = 'rapport_' . $startDate . '_' . $endDate . '.' . $extension;

        header('Content-Type: ' . $contentType);
        header('Content-Disposition: attachment;filename="' . $filename . '"');
        header('Cache-Control: max-age=0');

        $writer->save('php://output');
        exit;
    }

    public function productReport(Request $request)
    {
        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);

        $report = Transaction::query()
            ->whereBetween('created_at', [$startDate, $endDate])
            ->select(
                'products.name',
                DB::raw('SUM(CASE WHEN transactions.type = "out" THEN transactions.quantity ELSE 0 END) as sales_quantity'),
                DB::raw('SUM(CASE WHEN transactions.type = "in" THEN transactions.quantity ELSE 0 END) as purchase_quantity'),
                DB::raw('SUM(CASE WHEN transactions.type = "out" THEN transactions.total_price ELSE 0 END) as sales_amount'),
                DB::raw('SUM(CASE WHEN transactions.type = "in" THEN transactions.total_price ELSE 0 END) as purchase_amount'),
                DB::raw('SUM(CASE WHEN transactions.type = "out" THEN (transactions.sale_price - transactions.purchase_price) * transactions.quantity ELSE 0 END) as profit')
            )
            ->join('products', 'transactions.product_id', '=', 'products.id')
            ->groupBy('products.id', 'products.name')
            ->orderBy('products.name')
            ->get();

        return response()->json($report);
    }
}
