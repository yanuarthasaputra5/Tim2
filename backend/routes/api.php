<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\RolePermissionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Authentication & Role Management
|--------------------------------------------------------------------------
*/

// ==================== PUBLIC ROUTES ====================
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

// ==================== PROTECTED ROUTES ====================
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::get('/profile',     [AuthController::class, 'profile']);
        Route::post('/logout',     [AuthController::class, 'logout']);
        Route::post('/logout-all', [AuthController::class, 'logoutAll']);
    });

    // Role & Permission Management (khusus admin)
    Route::middleware('role:admin')->prefix('admin')->group(function () {

        // Roles
        Route::get('/roles',            [RolePermissionController::class, 'indexRoles']);
        Route::post('/roles',           [RolePermissionController::class, 'storeRole']);
        Route::put('/roles/{id}',       [RolePermissionController::class, 'updateRole']);
        Route::delete('/roles/{id}',    [RolePermissionController::class, 'destroyRole']);

        // Permissions
        Route::get('/permissions',         [RolePermissionController::class, 'indexPermissions']);
        Route::post('/permissions',        [RolePermissionController::class, 'storePermission']);
        Route::delete('/permissions/{id}', [RolePermissionController::class, 'destroyPermission']);

        // Assign/Revoke role ke user
        Route::post('/users/{userId}/assign-role', [RolePermissionController::class, 'assignRole']);
        Route::post('/users/{userId}/revoke-role', [RolePermissionController::class, 'revokeRole']);
    });

    // Contoh route dengan cek permission spesifik
    Route::middleware('can:manage-products')->group(function () {
        // Route::apiResource('/products', ProductController::class);
    });
});