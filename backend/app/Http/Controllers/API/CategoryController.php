<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Support\SlugGenerator;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Daftar kategori.
     */
    public function index(Request $request)
    {
        $request->validate([
            'search'    => ['sometimes', 'string', 'max:100'],
            'is_active' => ['sometimes', 'boolean'],
            'parent_id' => ['sometimes', 'nullable', 'uuid', 'exists:categories,id'],
            'per_page'  => ['sometimes', 'integer', 'between:1,100'],
        ], [
            'parent_id.exists' => 'Kategori induk yang dipilih tidak ditemukan.',
        ]);

        $query = Category::with(['parent', 'children']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if ($request->exists('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->filled('parent_id')) {
            $query->where('parent_id', $request->input('parent_id'));
        } elseif ($request->has('parent_id') && $request->input('parent_id') === null) {
            // Filter root categories (no parent)
            $query->whereNull('parent_id');
        }

        $perPage = (int) $request->input('per_page', 10);

        $categories = $query->orderBy('name')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data'    => [
                'data'         => $categories->items(),
                'current_page' => $categories->currentPage(),
                'last_page'    => $categories->lastPage(),
                'per_page'     => $categories->perPage(),
                'total'        => $categories->total(),
            ],
        ]);
    }

    /**
     * Detail kategori.
     */
    public function show(string $id)
    {
        $category = Category::with(['parent', 'children'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $category,
        ]);
    }

    /**
     * Buat kategori baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'      => ['required', 'string', 'max:100'],
            'slug'      => ['sometimes', 'nullable', 'string', 'max:100', 'regex:/^[a-z0-9\-]+$/'],
            'parent_id' => ['sometimes', 'nullable', 'uuid', 'exists:categories,id'],
            'image_url' => ['sometimes', 'nullable', 'string', 'max:500'],
            'is_active' => ['sometimes', 'boolean'],
        ], $this->messages());

        $slug = SlugGenerator::generate(
            $validated['slug'] ?? $validated['name'],
            'categories',
            null,
            100
        );

        $category = Category::create([
            'name'      => $validated['name'],
            'slug'      => $slug,
            'parent_id' => $validated['parent_id'] ?? null,
            'image_url' => $validated['image_url'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'success' => true,
            'data'    => $category->load(['parent', 'children']),
        ], 201);
    }

    /**
     * Perbarui kategori (partial update).
     */
    public function update(Request $request, string $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name'      => ['sometimes', 'string', 'max:100'],
            'slug'      => ['sometimes', 'nullable', 'string', 'max:100', 'regex:/^[a-z0-9\-]+$/'],
            'parent_id' => ['sometimes', 'nullable', 'uuid', 'exists:categories,id'],
            'image_url' => ['sometimes', 'nullable', 'string', 'max:500'],
            'is_active' => ['sometimes', 'boolean'],
        ], $this->messages());

        $data = collect($validated)->only(['name', 'parent_id', 'image_url', 'is_active'])->toArray();

        if ($request->exists('slug') || $request->exists('name')) {
            $explicit = $validated['slug'] ?? null;
            $source   = $explicit ?? ($validated['name'] ?? $category->name);

            if ($explicit !== null || ($request->exists('name') && $source !== $category->name)) {
                $data['slug'] = SlugGenerator::generate($source, 'categories', $category->id, 100);
            }
        }

        if (! empty($data)) {
            $category->update($data);
        }

        return response()->json([
            'success' => true,
            'data'    => $category->load(['parent', 'children']),
        ]);
    }

    /**
     * Hapus kategori.
     */
    public function destroy(string $id)
    {
        $category = Category::findOrFail($id);

        $category->products()->detach();
        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil dihapus.',
        ]);
    }

    private function messages(): array
    {
        return [
            'name.required'      => 'Nama kategori wajib diisi.',
            'name.max'           => 'Nama kategori maksimal 100 karakter.',
            'slug.regex'         => 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.',
            'slug.max'           => 'Slug kategori maksimal 100 karakter.',
            'parent_id.exists'   => 'Kategori induk yang dipilih tidak ditemukan.',
            'image_url.max'      => 'URL gambar maksimal 500 karakter.',
        ];
    }
}
