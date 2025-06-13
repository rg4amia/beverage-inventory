<?php

namespace App\Http\Controllers\Api;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Http\Controllers\Controller;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);
        $groupBy = $request->group_by ?? 'day';
        $type = $request->type ?? 'all';

        $query = Transaction::query()
            ->whereBetween('created_at', [$startDate, $endDate]);

        if ($type === 'sales') {
            $query->where('type', 'out');
        } elseif ($type === 'purchases') {
            $query->where('type', 'in');
        }

        $dateFormat = match ($groupBy) {
            'day' => '%Y-%m-%d',
            'month' => '%Y-%m',
            'year' => '%Y',
            default => '%Y-%m-%d',
        };

        $dateExpression = "DATE_FORMAT(created_at, '{$dateFormat}')";

        $report = $query->select(
            DB::raw("{$dateExpression} as date"),
            DB::raw('SUM(CASE WHEN type = "out" THEN quantity ELSE 0 END) as sales_quantity'),
            DB::raw('SUM(CASE WHEN type = "in" THEN quantity ELSE 0 END) as purchase_quantity'),
            DB::raw('SUM(CASE WHEN type = "out" THEN total_price ELSE 0 END) as sales_amount'),
            DB::raw('SUM(CASE WHEN type = "in" THEN total_price ELSE 0 END) as purchase_amount'),
            DB::raw('SUM(CASE WHEN type = "out" THEN (sale_price - purchase_price) * quantity ELSE 0 END) as profit')
        )
            ->groupBy(DB::raw($dateExpression))
            ->orderBy(DB::raw($dateExpression))
            ->get();

        $summary = $query->select(
            DB::raw('SUM(CASE WHEN type = "out" THEN total_price ELSE 0 END) as total_sales'),
            DB::raw('SUM(CASE WHEN type = "in" THEN total_price ELSE 0 END) as total_purchases'),
            DB::raw('SUM(CASE WHEN type = "out" THEN (sale_price - purchase_price) * quantity ELSE 0 END) as total_profit'),
            DB::raw('SUM(CASE WHEN type = "out" THEN quantity ELSE 0 END) as total_sales_quantity'),
            DB::raw('SUM(CASE WHEN type = "in" THEN quantity ELSE 0 END) as total_purchase_quantity')
        )->first();

        return response()->json([
            'report' => $report,
            'summary' => $summary,
        ]);
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
