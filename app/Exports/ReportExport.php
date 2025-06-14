<?php

namespace App\Exports;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Writer\Csv;

class ReportExport
{
 protected $data;
 protected $startDate;
 protected $endDate;

 public function __construct($data, $startDate, $endDate)
 {
  $this->data = $data;
  $this->startDate = $startDate;
  $this->endDate = $endDate;
 }

 public function export($format = 'xlsx')
 {
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
  foreach ($this->data['daily_stats'] as $date => $stats) {
   $sheet->setCellValue('A' . $row, $date);
   $sheet->setCellValue('B' . $row, $stats['sales_quantity'] ?? 0);
   $sheet->setCellValue('C' . $row, $stats['purchase_quantity'] ?? 0);
   $sheet->setCellValue('D' . $row, $stats['sales_amount'] ?? 0);
   $sheet->setCellValue('E' . $row, $stats['purchase_amount'] ?? 0);
   $sheet->setCellValue('F' . $row, $stats['profit'] ?? 0);
   $row++;
  }

  // Summary
  $row += 2;
  $sheet->setCellValue('A' . $row, 'Total');
  $sheet->setCellValue('B' . $row, collect($this->data['daily_stats'])->sum('sales_quantity'));
  $sheet->setCellValue('C' . $row, collect($this->data['daily_stats'])->sum('purchase_quantity'));
  $sheet->setCellValue('D' . $row, collect($this->data['daily_stats'])->sum('sales_amount'));
  $sheet->setCellValue('E' . $row, collect($this->data['daily_stats'])->sum('purchase_amount'));
  $sheet->setCellValue('F' . $row, collect($this->data['daily_stats'])->sum('profit'));

  if ($format === 'xlsx') {
   $writer = new Xlsx($spreadsheet);
   $contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
   $extension = 'xlsx';
  } else {
   $writer = new Csv($spreadsheet);
   $contentType = 'text/csv';
   $extension = 'csv';
  }

  $filename = 'rapport_' . $this->startDate->format('Y-m-d') . '_' . $this->endDate->format('Y-m-d') . '.' . $extension;

  header('Content-Type: ' . $contentType);
  header('Content-Disposition: attachment;filename="' . $filename . '"');
  header('Cache-Control: max-age=0');

  $writer->save('php://output');
  exit;
 }
}