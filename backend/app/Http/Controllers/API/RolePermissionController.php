<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionController extends Controller
{
    // ==================== ROLES ====================

    /**
     * List semua role.
     */
    public function indexRoles()
    {
        $roles = Role::with('permissions')->get()->map(function ($role) {
            return [
                'id'          => $role->id,
                'name'        => $role->name,
                'permissions' => $role->permissions->pluck('name'),
            ];
        });

        return response()->json(['success' => true, 'data' => $roles]);
    }

    /**
     * Buat role baru.
     */
    public function storeRole(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|unique:roles,name',
            'permissions' => 'sometimes|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $role = Role::create(['name' => $request->name, 'guard_name' => 'sanctum']);

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return response()->json([
            'success' => true,
            'message' => 'Role berhasil dibuat',
            'data'    => $role->load('permissions'),
        ], 201);
    }

    /**
     * Update role.
     */
    public function updateRole(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        $request->validate([
            'name'          => 'sometimes|string|unique:roles,name,' . $id,
            'permissions'   => 'sometimes|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        if ($request->has('name')) {
            $role->update(['name' => $request->name]);
        }

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return response()->json([
            'success' => true,
            'message' => 'Role berhasil diupdate',
            'data'    => $role->load('permissions'),
        ]);
    }

    /**
     * Hapus role.
     */
    public function destroyRole($id)
    {
        $role = Role::findOrFail($id);

        // Cegah hapus role default
        if (in_array($role->name, ['admin', 'user'])) {
            return response()->json([
                'success' => false,
                'message' => 'Role default tidak bisa dihapus',
            ], 403);
        }

        $role->delete();

        return response()->json(['success' => true, 'message' => 'Role berhasil dihapus']);
    }

    // ==================== PERMISSIONS ====================

    /**
     * List semua permission (dengan id dan name).
     */
    public function indexPermissions()
    {
        $permissions = Permission::all()->map(fn($p) => [
            'id'   => $p->id,
            'name' => $p->name,
        ]);

        return response()->json(['success' => true, 'data' => $permissions]);
    }

    /**
     * Buat permission baru.
     */
    public function storePermission(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:permissions,name',
        ]);

        $permission = Permission::create(['name' => $request->name, 'guard_name' => 'sanctum']);

        return response()->json([
            'success' => true,
            'message' => 'Permission berhasil dibuat',
            'data'    => $permission,
        ], 201);
    }

    /**
     * Hapus permission.
     */
    public function destroyPermission($id)
    {
        $permission = Permission::findOrFail($id);
        $permission->delete();

        return response()->json(['success' => true, 'message' => 'Permission berhasil dihapus']);
    }

    // ==================== USER ROLES ====================

    /**
     * Assign role ke user.
     */
    public function assignRole(Request $request, $userId)
    {
        $request->validate([
            'role' => 'required|string|exists:roles,name',
        ]);

        $user = User::findOrFail($userId);
        $user->assignRole($request->role);

        return response()->json([
            'success' => true,
            'message' => "Role '{$request->role}' berhasil di-assign ke {$user->name}",
            'data'    => [
                'user'  => $user->name,
                'roles' => $user->getRoleNames(),
            ],
        ]);
    }

    /**
     * Cabut role dari user.
     */
    public function revokeRole(Request $request, $userId)
    {
        $request->validate([
            'role' => 'required|string|exists:roles,name',
        ]);

        $user = User::findOrFail($userId);
        $user->removeRole($request->role);

        return response()->json([
            'success' => true,
            'message' => "Role '{$request->role}' berhasil dicabut dari {$user->name}",
            'data'    => [
                'user'  => $user->name,
                'roles' => $user->getRoleNames(),
            ],
        ]);
    }
}