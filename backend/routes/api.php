<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\RolePermissionController;
use App\Http\Controllers\API\UserController;
use Illuminate\Support\Facades\Route;

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

    // Admin only
    Route::middleware('role:admin')->prefix('admin')->group(function () {

        // Roles
        Route::get('/roles',         [RolePermissionController::class, 'indexRoles']);
        Route::post('/roles',        [RolePermissionController::class, 'storeRole']);
        Route::put('/roles/{id}',    [RolePermissionController::class, 'updateRole']);
        Route::delete('/roles/{id}', [RolePermissionController::class, 'destroyRole']);

        // Permissions
        Route::get('/permissions',            [RolePermissionController::class, 'indexPermissions']);
        Route::post('/permissions',           [RolePermissionController::class, 'storePermission']);
        Route::delete('/permissions/{id}',    [RolePermissionController::class, 'destroyPermission']);

        // User Management
        Route::get('/users',                          [UserController::class, 'index']);
        Route::get('/users/{id}',                     [UserController::class, 'show']);
        Route::post('/users/{id}/change-password',    [UserController::class, 'changePassword']);
        Route::delete('/users/{id}',                  [UserController::class, 'destroy']);

        // Assign role ke user (tetap ada untuk keperluan admin)
        Route::post('/users/{userId}/assign-role',    [RolePermissionController::class, 'assignRole']);
    });
});
