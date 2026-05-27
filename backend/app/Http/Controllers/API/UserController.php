<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * List semua user.
     */
    public function index()
    {
        $users = User::with('roles')->get()->map(function ($user) {
            return $this->formatUser($user);
        });

        return response()->json(['success' => true, 'data' => $users]);
    }

    /**
     * Detail user.
     */
    public function show($id)
    {
        $user = User::with('roles')->findOrFail($id);

        return response()->json(['success' => true, 'data' => $this->formatUser($user)]);
    }

    /**
     * Ganti password user (oleh admin).
     */
    public function changePassword(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'password' => ['required', 'string', Password::min(8), 'confirmed'],
        ]);

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        // Revoke semua token user agar harus login ulang
        $user->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => "Password {$user->name} berhasil diubah",
        ]);
    }

    /**
     * Hapus user.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Cegah hapus diri sendiri
        if ($user->id === auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak bisa menghapus akun sendiri',
            ], 403);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json(['success' => true, 'message' => 'User berhasil dihapus']);
    }

    private function formatUser(User $user): array
    {
        return [
            'id'         => $user->id,
            'name'       => $user->name,
            'email'      => $user->email,
            'roles'      => $user->getRoleNames(),
            'created_at' => $user->created_at,
        ];
    }
}
