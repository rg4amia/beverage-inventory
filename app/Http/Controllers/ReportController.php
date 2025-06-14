<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Product;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\PDF;
use App\Exports\ReportExport;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Reports/Index');
    }

    public function generateReport(Request $request)
    {
        $type = $request->input('type');
        $format = $request->input('format');
        $startDate = Carbon::parse($request->input('start_date'));
        $endDate = Carbon::parse($request->input('end_date'));
        $productId = $request->input('product_id');
        $transactionType = $request->input('transaction_type');

        // Build the base query
        $query = Transaction::whereBetween('created_at', [$startDate, $endDate])
            ->with(['product', 'user']);

        // Apply additional filters
        if ($productId) {
            $query->where('product_id', $productId);
        }
        if ($transactionType) {
            $query->where('type', $transactionType);
        }

        $transactions = $query->get();

        // Calculate advanced statistics
        $stats = $this->calculateStats($transactions);

        $data = [
            'transactions' => $transactions,
            'daily_stats' => $stats['daily_stats'], // Ensure daily_stats is included
            'start_date' => $startDate,
            'end_date' => $endDate,
            'type' => $type,
            'stats' => $stats,
            'filters' => [
                'product_id' => $productId,
                'transaction_type' => $transactionType,
            ]
        ];

        $filename = 'report-' . $type . '-' . $startDate->format('Y-m-d') . '-' . $endDate->format('Y-m-d') . '.' . $format;

        if ($format === 'pdf') {
            $pdf = PDF::loadView('reports.pdf', $data);
            $pdfPath = storage_path('app/public/reports/' . $filename);
            $pdf->save($pdfPath);

            return response()->json([
                'download_url' => Storage::url('reports/' . $filename),
                'filename' => $filename
            ]);
        } else {
            $export = new ReportExport($data, $startDate, $endDate);
            $filePath = storage_path('app/public/reports/' . $filename);

            // Save the file to storage
            ob_start();
            $export->export($format);
            $content = ob_get_clean();
            Storage::put('public/reports/' . $filename, $content);

            return response()->json([
                'download_url' => Storage::url('reports/' . $filename),
                'filename' => $filename
            ]);
        }
    }

    public function preview(Request $request)
    {
        $startDate = Carbon::parse($request->input('start_date'));
        $endDate = Carbon::parse($request->input('end_date'));
        $productId = $request->input('product_id');
        $transactionType = $request->input('transaction_type');

        // Build the base query
        $query = Transaction::whereBetween('created_at', [$startDate, $endDate])
            ->with(['product', 'user']);

        // Apply additional filters
        if ($productId) {
            $query->where('product_id', $productId);
        }
        if ($transactionType) {
            $query->where('type', $transactionType);
        }

        $transactions = $query->get();
        $stats = $this->calculateStats($transactions);

        return response()->json([
            'transactions' => $transactions,
            'stats' => $stats
        ]);
    }

    private function calculateStats($transactions)
    {
        // Basic statistics
        $stats = [
            'total_transactions' => $transactions->count(),
            'total_quantity' => $transactions->sum('quantity'),
            'total_value' => $transactions->sum(function ($transaction) {
                return $transaction->quantity * $transaction->product->price;
            }),
            'average_transaction_value' => $transactions->avg(function ($transaction) {
                return $transaction->quantity * $transaction->product->price;
            }),
        ];

        // Statistics by type
        $stats['by_type'] = $transactions->groupBy('type')->map(function ($group) use ($transactions) {
            return [
                'count' => $group->count(),
                'quantity' => $group->sum('quantity'),
                'value' => $group->sum(function ($transaction) {
                    return $transaction->quantity * $transaction->product->price;
                }),
                'percentage' => ($group->count() / $transactions->count()) * 100
            ];
        });

        // Statistics by product
        $stats['by_product'] = $transactions->groupBy('product_id')->map(function ($group) use ($transactions) {
            return [
                'name' => $group->first()->product->name,
                'count' => $group->count(),
                'quantity' => $group->sum('quantity'),
                'value' => $group->sum(function ($transaction) {
                    return $transaction->quantity * $transaction->product->price;
                }),
                'percentage' => ($group->count() / $transactions->count()) * 100
            ];
        });

        // Daily statistics
        $stats['daily_stats'] = $transactions->groupBy(function ($transaction) {
            return $transaction->created_at->format('Y-m-d');
        })->map(function ($group) {
            $sales = $group->where('type', 'out');
            $purchases = $group->where('type', 'in');

            return [
                'sales_quantity' => $sales->sum('quantity'),
                'purchase_quantity' => $purchases->sum('quantity'),
                'sales_amount' => $sales->sum(function ($transaction) {
                    return $transaction->quantity * $transaction->sale_price;
                }),
                'purchase_amount' => $purchases->sum(function ($transaction) {
                    return $transaction->quantity * $transaction->purchase_price;
                }),
                'profit' => $sales->sum(function ($transaction) {
                    return ($transaction->sale_price - $transaction->purchase_price) * $transaction->quantity;
                })
            ];
        });

        // Trends
        $stats['trends'] = [
            'daily_average' => $transactions->count() / max(1, $transactions->groupBy(function ($transaction) {
                return $transaction->created_at->format('Y-m-d');
            })->count()),
            'quantity_per_transaction' => $transactions->avg('quantity'),
            'value_per_transaction' => $transactions->avg(function ($transaction) {
                return $transaction->quantity * $transaction->product->price;
            })
        ];

        return $stats;
    }
}