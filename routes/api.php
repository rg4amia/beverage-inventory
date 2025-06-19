<?php

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\CategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Routes publiques
Route::prefix('v1')->name('api.')->group(function () {
    Route::post('/login', [App\Http\Controllers\Api\AuthController::class, 'login']);
});

// Routes pour les rapports
//Route::get('/reports', [App\Http\Controllers\Api\ReportController::class, 'index']);
//Route::get('/reports/products', [App\Http\Controllers\Api\ReportController::class, 'productReport']);

//Route::get('/reports/export', [ReportController::class, 'export']);

// Routes protégées
Route::middleware('auth:sanctum')->prefix('v1')->name('api.')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Routes pour les produits
    Route::get('/products/low-stock', [ProductController::class, 'lowStock']);
    Route::apiResource('products', ProductController::class);

    Route::apiResource('dashboard', DashboardController::class);
    Route::apiResource('categories', CategoryController::class);

    // Routes pour les transactions
    Route::get('/transactions/statistics', [TransactionController::class, 'statistics']);
    Route::apiResource('transactions', TransactionController::class);
});
