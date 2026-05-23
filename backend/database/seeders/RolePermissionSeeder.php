<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cache roles & permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // ==================== PERMISSIONS ====================
        $permissions = [
            // User management
            'view-users',
            'create-users',
            'edit-users',
            'delete-users',

            // Role management
            'manage-roles',
            'manage-permissions',

            // Products (contoh modul)
            'view-products',
            'manage-products',

            // Orders (contoh modul)
            'view-orders',
            'manage-orders',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name'       => $permission,
                'guard_name' => 'sanctum',
            ]);
        }

        // ==================== ROLES ====================

        // Admin - semua permission
        $adminRole = Role::firstOrCreate([
            'name'       => 'admin',
            'guard_name' => 'sanctum',
        ]);
        $adminRole->syncPermissions($permissions);

        // Manager - permission terbatas
        $managerRole = Role::firstOrCreate([
            'name'       => 'manager',
            'guard_name' => 'sanctum',
        ]);
        $managerRole->syncPermissions([
            'view-users',
            'view-products',
            'manage-products',
            'view-orders',
            'manage-orders',
        ]);

        // User - permission minimal
        $userRole = Role::firstOrCreate([
            'name'       => 'user',
            'guard_name' => 'sanctum',
        ]);
        $userRole->syncPermissions([
            'view-products',
            'view-orders',
        ]);

        // ==================== DEFAULT ADMIN USER ====================
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name'     => 'Administrator',
                'password' => Hash::make('password123'),
            ]
        );
        $admin->assignRole('admin');

        // Default Manager
        $manager = User::firstOrCreate(
            ['email' => 'manager@example.com'],
            [
                'name'     => 'Manager',
                'password' => Hash::make('password123'),
            ]
        );
        $manager->assignRole('manager');

        // Default User
        $user = User::firstOrCreate(
            ['email' => 'user@example.com'],
            [
                'name'     => 'Regular User',
                'password' => Hash::make('password123'),
            ]
        );
        $user->assignRole('user');

        $this->command->info('✅ Roles, permissions, dan default users berhasil dibuat!');
        $this->command->table(
            ['Email', 'Password', 'Role'],
            [
                ['admin@example.com',   'password123', 'admin'],
                ['manager@example.com', 'password123', 'manager'],
                ['user@example.com',    'password123', 'user'],
            ]
        );
    }
}