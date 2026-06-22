<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Support\SlugGenerator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * Relasi yang selalu disertakan pada respons produk.
     */
    private array $relations = ['categories', 'images', 'variants'];

    /**
     * Daftar produk dengan filter, pencarian, dan paginasi.
     */
    public function index(Request $request)
    {
        $request->validate([
            'search'      => ['sometimes', 'string', 'max:255'],
            'category_id' => ['sometimes', 'uuid', 'exists:categories,id'],
            'is_active'   => ['sometimes', 'boolean'],
            'min_price'   => ['sometimes', 'numeric', 'min:0'],
            'max_price'   => ['sometimes', 'numeric', 'min:0'],
            'per_page'    => ['sometimes', 'integer', 'between:1,100'],
        ], [], [
            'category_id' => 'kategori',
            'is_active'   => 'status aktif',
            'min_price'   => 'harga minimum',
            'max_price'   => 'harga maksimum',
            'per_page'    => 'jumlah per halaman',
        ]);

        $query = Product::with($this->relations);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category_id')) {
            $categoryId = $request->input('category_id');
            $query->whereHas('categories', function ($q) use ($categoryId) {
                $q->where('categories.id', $categoryId);
            });
        }

        if ($request->exists('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->input('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->input('max_price'));
        }

        $perPage = (int) $request->input('per_page', 10);

        $products = $query->orderByDesc('created_at')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data'    => [
                'data'         => $products->items(),
                'current_page' => $products->currentPage(),
                'last_page'    => $products->lastPage(),
                'per_page'     => $products->perPage(),
                'total'        => $products->total(),
            ],
        ]);
    }

    /**
     * Detail satu produk.
     */
    public function show(string $id)
    {
        $product = Product::with($this->relations)->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $product,
        ]);
    }

    /**
     * Buat produk baru beserta data turunannya.
     */
    public function store(Request $request)
    {
        $validated = $request->validate(
            $this->rules(),
            $this->messages()
        );

        $product = DB::transaction(function () use ($validated, $request) {
            $slug = $this->resolveSlug(
                $validated['slug'] ?? null,
                $validated['name'],
                null
            );

            $product = Product::create([
                'name'        => $validated['name'],
                'slug'        => $slug,
                'description' => $validated['description'] ?? null,
                'price'       => $validated['price'],
                'weight_gram' => $validated['weight_gram'] ?? 0,
                'stock'       => $validated['stock'],
                'is_active'   => $validated['is_active'] ?? true,
            ]);

            if ($request->filled('categories')) {
                $product->categories()->sync($validated['categories']);
            }

            if (! empty($validated['variants'])) {
                foreach ($validated['variants'] as $variant) {
                    $product->variants()->create($variant);
                }
            }

            if (! empty($validated['images'])) {
                $this->createImages($product, $validated['images']);
            }

            return $product;
        });

        return response()->json([
            'success' => true,
            'data'    => $product->load($this->relations),
        ], 201);
    }

    /**
     * Perbarui produk (partial update).
     */
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate(
            $this->rules(true, $product->id),
            $this->messages()
        );

        $product = DB::transaction(function () use ($product, $validated, $request) {
            $data = collect($validated)->only([
                'name', 'description', 'price', 'weight_gram', 'stock', 'is_active',
            ])->toArray();

            // Tentukan slug bila name atau slug berubah.
            if ($request->exists('slug') || $request->exists('name')) {
                $source = $validated['slug'] ?? ($validated['name'] ?? $product->name);
                $explicit = $validated['slug'] ?? null;

                // Hanya regenerasi bila ada perubahan relevan.
                if ($explicit !== null || ($request->exists('name') && $source !== $product->name)) {
                    $data['slug'] = $this->resolveSlug($explicit, $source, $product->id);
                }
            }

            if (! empty($data)) {
                $product->update($data);
            }

            if ($request->exists('categories')) {
                $product->categories()->sync($validated['categories'] ?? []);
            }

            return $product;
        });

        return response()->json([
            'success' => true,
            'data'    => $product->load($this->relations),
        ]);
    }

    /**
     * Hapus produk beserta data turunannya.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);

        DB::transaction(function () use ($product) {
            $product->variants()->delete();
            $product->images()->delete();
            $product->categories()->detach();
            $product->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil dihapus.',
        ]);
    }

    /**
     * Sinkronkan asosiasi kategori produk.
     */
    public function syncCategories(Request $request, string $product)
    {
        $product = Product::findOrFail($product);

        $validated = $request->validate([
            'categories'   => ['present', 'array'],
            'categories.*' => ['uuid', 'exists:categories,id'],
        ], [
            'categories.present'  => 'Daftar kategori wajib disertakan.',
            'categories.array'    => 'Daftar kategori harus berupa array.',
            'categories.*.exists' => 'Salah satu kategori yang dipilih tidak ditemukan.',
        ]);

        $product->categories()->sync($validated['categories']);

        return response()->json([
            'success' => true,
            'data'    => $product->load($this->relations),
        ]);
    }

    /**
     * Tentukan slug unik: pakai slug eksplisit bila ada, jika tidak hasilkan dari name.
     */
    private function resolveSlug(?string $explicitSlug, string $source, ?string $ignoreId): string
    {
        $base = $explicitSlug !== null && $explicitSlug !== '' ? $explicitSlug : $source;

        return SlugGenerator::generate($base, 'products', $ignoreId, 255);
    }

    /**
     * Buat gambar produk sambil menjaga hanya satu gambar utama.
     */
    private function createImages(Product $product, array $images): void
    {
        foreach ($images as $index => $image) {

            $path = $image->store(
                'products',
                'public'
            );

            $product->images()->create([
                'url' => '/storage/' . $path,
                'is_primary' => $index === 0,
                'sort_order' => $index,
            ]);
        }
    }

    /**
     * Aturan validasi produk.
     */
    private function rules(bool $isUpdate = false, ?string $ignoreId = null): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return [
            'name'                 => [$required, 'string', 'max:255'],
            'slug'                 => ['sometimes', 'nullable', 'string', 'max:255', 'regex:/^[a-z0-9\-]+$/'],
            'description'          => ['sometimes', 'nullable', 'string'],
            'price'                => [$required, 'numeric', 'min:0'],
            'weight_gram'          => ['sometimes', 'integer', 'min:0'],
            'stock'                => [$required, 'integer', 'min:0'],
            'is_active'            => ['sometimes', 'boolean'],

            'categories'           => ['sometimes', 'array'],
            'categories.*'         => ['uuid', 'exists:categories,id'],

            'variants'             => ['sometimes', 'array'],
            'variants.*.name'      => ['required_with:variants', 'string', 'max:100'],
            'variants.*.sku'       => ['required_with:variants', 'string', 'max:100', 'unique:product_variants,sku'],
            'variants.*.price'     => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'variants.*.stock'     => ['required_with:variants', 'integer', 'min:0'],
            'variants.*.is_active' => ['sometimes', 'boolean'],

            'images'               => ['sometimes', 'array'],
            'images.*'             => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'images.*.is_primary'  => ['sometimes', 'boolean'],
            'images.*.sort_order'  => ['sometimes', 'integer', 'min:0'],
        ];
    }

    /**
     * Pesan validasi dalam Bahasa Indonesia.
     */
    private function messages(): array
    {
        return [
            'name.required'        => 'Nama produk wajib diisi.',
            'name.max'             => 'Nama produk maksimal 255 karakter.',
            'slug.regex'           => 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.',
            'price.required'       => 'Harga produk wajib diisi.',
            'price.numeric'        => 'Harga harus berupa angka.',
            'price.min'            => 'Harga tidak boleh kurang dari 0.',
            'weight_gram.integer'  => 'Berat harus berupa bilangan bulat.',
            'weight_gram.min'      => 'Berat tidak boleh kurang dari 0.',
            'stock.required'       => 'Stok produk wajib diisi.',
            'stock.integer'        => 'Stok harus berupa bilangan bulat.',
            'stock.min'            => 'Stok tidak boleh kurang dari 0.',

            'categories.*.exists'  => 'Salah satu kategori yang dipilih tidak ditemukan.',

            'variants.*.name.required_with'  => 'Nama varian wajib diisi.',
            'variants.*.sku.required_with'   => 'SKU varian wajib diisi.',
            'variants.*.sku.unique'          => 'SKU varian sudah digunakan.',
            'variants.*.price.min'           => 'Harga varian tidak boleh kurang dari 0.',
            'variants.*.stock.required_with' => 'Stok varian wajib diisi.',
            'variants.*.stock.min'           => 'Stok varian tidak boleh kurang dari 0.',

            'images.*.url.required_with' => 'URL gambar wajib diisi.',
        ];
    }
}
