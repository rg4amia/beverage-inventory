<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\Exportable;

class TransactionExport implements FromCollection,WithHeadings, WithMapping
{

    use Exportable;
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function collection()
    {
        return $this->data['transactions'];
    }

    public function headings(): array
    {
    return [
    'Date',
    'Produit',
    'Quantité',
    'Type',
    'Utilisateur'
    ];
    }

    public function map($transaction): array
    {
    return [
    $transaction->created_at->format('d/m/Y H:i'),
    $transaction->product->name,
    $transaction->quantity,
    $transaction->type,
    $transaction->user->name
    ];
    }
}