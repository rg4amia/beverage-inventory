<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f5f5f5;
        }

        .summary-row {
            font-weight: bold;
            background-color: #f9f9f9;
        }
    </style>
</head>

<body>
    <h1>Transaction Report</h1>
    <p>Period: {{ $start_date->format('Y-m-d') }} to {{ $end_date->format('Y-m-d') }}</p>

    <h2>Transactions</h2>
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Amount</th>
            </tr>
        </thead>
        <tbody>
            @php
                $totalQuantity = 0;
                $totalAmount = 0;
            @endphp

            @foreach ($transactions as $transaction)
                @php
                    $amount = $transaction->quantity * $transaction->product->price;
                    $totalQuantity += $transaction->quantity;
                    $totalAmount += $amount;
                @endphp
                <tr>
                    <td>{{ $transaction->created_at->format('Y-m-d H:i') }}</td>
                    <td>{{ $transaction->product->name }}</td>
                    <td>{{ ucfirst($transaction->type) }}</td>
                    <td>{{ $transaction->quantity }}</td>
                    <td>{{ number_format($transaction->product->price, 2) }}</td>
                    <td>{{ number_format($amount, 2) }}</td>
                </tr>
            @endforeach

            <tr class="summary-row">
                <td colspan="3">Total</td>
                <td>{{ $totalQuantity }}</td>
                <td></td>
                <td>{{ number_format($totalAmount, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <h2>Daily Summary</h2>
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Sales Quantity</th>
                <th>Purchase Quantity</th>
                <th>Sales Amount</th>
                <th>Purchase Amount</th>
                <th>Profit</th>
            </tr>
        </thead>
        <tbody>
            @php
                $totalSalesQuantity = 0;
                $totalPurchaseQuantity = 0;
                $totalSalesAmount = 0;
                $totalPurchaseAmount = 0;
                $totalProfit = 0;
            @endphp

            @foreach ($stats['daily_stats'] as $date => $daily)
                @php
                    $totalSalesQuantity += $daily['sales_quantity'];
                    $totalPurchaseQuantity += $daily['purchase_quantity'];
                    $totalSalesAmount += $daily['sales_amount'];
                    $totalPurchaseAmount += $daily['purchase_amount'];
                    $totalProfit += $daily['profit'];
                @endphp
                <tr>
                    <td>{{ $date }}</td>
                    <td>{{ $daily['sales_quantity'] }}</td>
                    <td>{{ $daily['purchase_quantity'] }}</td>
                    <td>{{ number_format($daily['sales_amount'], 2) }}</td>
                    <td>{{ number_format($daily['purchase_amount'], 2) }}</td>
                    <td>{{ number_format($daily['profit'], 2) }}</td>
                </tr>
            @endforeach

            <tr class="summary-row">
                <td>Total</td>
                <td>{{ $totalSalesQuantity }}</td>
                <td>{{ $totalPurchaseQuantity }}</td>
                <td>{{ number_format($totalSalesAmount, 2) }}</td>
                <td>{{ number_format($totalPurchaseAmount, 2) }}</td>
                <td>{{ number_format($totalProfit, 2) }}</td>
            </tr>
        </tbody>
    </table>
</body>

</html>
