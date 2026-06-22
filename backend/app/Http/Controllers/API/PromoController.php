<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Promo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class PromoController extends Controller
{
    /**
     * Relasi yang selalu disertakan pada respons promo.
     */
    private array $relations = ['products', 'categories'];

    /**
     * Daftar promo dengan filter, pencarian, dan paginasi.
     */
    public function index(Request $request)
    {
        $request->validate([
            'search'    => ['sometimes', 'string', 'max:255'],
            'scope'     => ['sometimes', 'string', Rule::in(['all', 'product', 'category'])],
            'type'      => ['sometimes', 'string', Rule::in(['percent', 'fixed', 'free_shipping'])],
            'is_active' => ['sometimes', 'boolean'],
            'per_page'  => ['sometimes', 'integer', 'between:1,100'],
        ], [], [
            'scope'     => 'lingkup promo',
            'type'      => 'tipe diskon',
            'is_active' => 'status aktif',
            'per_page'  => 'jumlah per halaman',
        ]);

        $query = Promo::with($this->relations);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('scope')) {
            $query->where('scope', $request->input('scope'));
        }

        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->exists('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $perPage = (int) $request->input('per_page', 10);

        $promos = $query->orderByDesc('starts_at')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data'    => [
                'data'         => $promos->items(),
                'current_page' => $promos->currentPage(),
                'last_page'    => $promos->lastPage(),
                'per_page'     => $promos->perPage(),
                'total'        => $promos->total(),
            ],
        ]);
    }

    /**
     * Detail satu promo.
     */
    public function show(string $id)
    {
        $promo = Promo::with($this->relations)->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $promo,
        ]);
    }

    /**
     * Buat promo baru beserta relasi produk/kategori.
     */
    public function store(Request $request)
    {
        $validated = $request->validate(
            $this->rules(),
            $this->messages()
        );

        $promo = DB::transaction(function () use ($validated) {
            $promo = Promo::create([
                'code'         => strtoupper($validated['code']),
                'name'         => $validated['name'] ?? null,
                'scope'        => $validated['scope'],
                'type'         => $validated['type'],
                'value'        => $validated['value'],
                'min_order'    => $validated['min_order'] ?? 0,
                'max_discount' => $validated['max_discount'] ?? null,
                'max_usage'    => $validated['max_usage'] ?? 1,
                'starts_at'    => $validated['starts_at'],
                'ends_at'      => $validated['ends_at'],
                'is_active'    => $validated['is_active'] ?? true,
            ]);

            if (! empty($validated['product_ids'])) {
                $promo->products()->sync($validated['product_ids']);
            }

            if (! empty($validated['category_ids'])) {
                $promo->categories()->sync($validated['category_ids']);
            }

            return $promo;
        });

        return response()->json([
            'success' => true,
            'data'    => $promo->load($this->relations),
        ], 201);
    }

    /**
     * Perbarui promo (partial update).
     */
    public function update(Request $request, string $id)
    {
        $promo = Promo::findOrFail($id);

        $validated = $request->validate(
            $this->rules(true, $promo->id),
            $this->messages()
        );

        $promo = DB::transaction(function () use ($promo, $validated, $request) {
            $data = collect($validated)->only([
                'code', 'name', 'scope', 'type', 'value',
                'min_order', 'max_discount', 'max_usage',
                'starts_at', 'ends_at', 'is_active',
            ])->toArray();

            if (isset($data['code'])) {
                $data['code'] = strtoupper($data['code']);
            }

            if (! empty($data)) {
                $promo->update($data);
            }

            if ($request->exists('product_ids')) {
                $promo->products()->sync($validated['product_ids'] ?? []);
            }

            if ($request->exists('category_ids')) {
                $promo->categories()->sync($validated['category_ids'] ?? []);
            }

            return $promo;
        });

        return response()->json([
            'success' => true,
            'data'    => $promo->load($this->relations),
        ]);
    }

    /**
     * Hapus promo beserta relasi.
     */
    public function destroy(string $id)
    {
        $promo = Promo::findOrFail($id);

        DB::transaction(function () use ($promo) {
            $promo->products()->detach();
            $promo->categories()->detach();
            $promo->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Promo berhasil dihapus.',
        ]);
    }

    /**
     * Validasi kode promo dan hitung diskon (untuk frontend).
     */
    public function validate(Request $request)
    {
        $validated = $request->validate([
            'code'          => ['required', 'string', 'max:50'],
            'order_total'   => ['required', 'numeric', 'min:0'],
            'product_ids'   => ['sometimes', 'array'],
            'product_ids.*' => ['uuid', 'exists:products,id'],
        ], [
            'code.required'        => 'Kode promo wajib diisi.',
            'order_total.required' => 'Total pesanan wajib diisi.',
            'order_total.numeric'  => 'Total pesanan harus berupa angka.',
            'product_ids.*.exists' => 'Salah satu produk tidak ditemukan.',
        ]);

        $promo = Promo::where('code', strtoupper($validated['code']))->first();

        if (! $promo) {
            return response()->json([
                'success' => false,
                'message' => 'Kode promo tidak ditemukan.',
            ], 404);
        }

        if (! $promo->isValid()) {
            return response()->json([
                'success' => false,
                'message' => 'Promo sudah tidak berlaku atau sudah habis.',
            ], 422);
        }

        $productIds = $validated['product_ids'] ?? [];

        if (! empty($productIds) && ! $promo->isApplicableToProducts($productIds)) {
            return response()->json([
                'success' => false,
                'message' => 'Promo tidak berlaku untuk produk yang dipilih.',
            ], 422);
        }

        $orderTotal = (float) $validated['order_total'];

        if ($orderTotal < (float) $promo->min_order) {
            return response()->json([
                'success' => false,
                'message' => 'Minimum pembelian untuk promo ini adalah Rp ' . number_format($promo->min_order, 0, ',', '.') . '.',
            ], 422);
        }

        $discount   = $promo->calculateDiscount($orderTotal);
        $finalTotal = max(0, $orderTotal - $discount);

        return response()->json([
            'success' => true,
            'data'    => [
                'promo'       => $promo->load($this->relations),
                'discount'    => $discount,
                'final_total' => round($finalTotal, 2),
            ],
        ]);
    }

    /**
     * Aturan validasi promo.
     */
    private function rules(bool $isUpdate = false, ?string $ignoreId = null): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        $codeUnique = $ignoreId
            ? Rule::unique('promos', 'code')->ignore($ignoreId)
            : Rule::unique('promos', 'code');

        return [
            'code'           => [$required, 'string', 'max:50', $codeUnique],
            'name'           => ['sometimes', 'nullable', 'string', 'max:255'],
            'scope'          => [$required, 'string', Rule::in(['all', 'product', 'category'])],
            'type'           => [$required, 'string', Rule::in(['percent', 'fixed', 'free_shipping'])],
            'value'          => [$required, 'numeric', 'min:0'],
            'min_order'      => ['sometimes', 'numeric', 'min:0'],
            'max_discount'   => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'max_usage'      => ['sometimes', 'integer', 'min:1'],
            'starts_at'      => [$required, 'date'],
            'ends_at'        => [$required, 'date', 'after:starts_at'],
            'is_active'      => ['sometimes', 'boolean'],

            'product_ids'    => ['sometimes', 'array'],
            'product_ids.*'  => ['uuid', 'exists:products,id'],
            'category_ids'   => ['sometimes', 'array'],
            'category_ids.*' => ['uuid', 'exists:categories,id'],
        ];
    }

    /**
     * Pesan validasi dalam Bahasa Indonesia.
     */
    private function messages(): array
    {
        return [
            'code.required'       => 'Kode promo wajib diisi.',
            'code.max'            => 'Kode promo maksimal 50 karakter.',
            'code.unique'         => 'Kode promo sudah digunakan.',
            'scope.required'      => 'Scope promo wajib diisi.',
            'scope.in'            => 'Scope harus salah satu dari: all, product, category.',
            'type.required'       => 'Tipe diskon wajib diisi.',
            'type.in'             => 'Tipe diskon harus salah satu dari: percent, fixed, free_shipping.',
            'value.required'      => 'Nilai diskon wajib diisi.',
            'value.numeric'       => 'Nilai diskon harus berupa angka.',
            'value.min'           => 'Nilai diskon tidak boleh kurang dari 0.',
            'min_order.numeric'   => 'Minimum order harus berupa angka.',
            'max_discount.numeric'=> 'Maksimal diskon harus berupa angka.',
            'max_usage.integer'   => 'Maksimal penggunaan harus berupa bilangan bulat.',
            'max_usage.min'       => 'Maksimal penggunaan minimal 1.',
            'starts_at.required'  => 'Tanggal mulai promo wajib diisi.',
            'starts_at.date'      => 'Tanggal mulai harus berupa tanggal yang valid.',
            'ends_at.required'    => 'Tanggal berakhir promo wajib diisi.',
            'ends_at.date'        => 'Tanggal berakhir harus berupa tanggal yang valid.',
            'ends_at.after'       => 'Tanggal berakhir harus setelah tanggal mulai.',

            'product_ids.*.exists'  => 'Salah satu produk yang dipilih tidak ditemukan.',
            'category_ids.*.exists' => 'Salah satu kategori yang dipilih tidak ditemukan.',
        ];
    }
}
