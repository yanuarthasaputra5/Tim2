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
    private array $relations = ['products'];

    /**
     * Daftar promo dengan filter, pencarian, dan paginasi.
     */
    public function index(Request $request)
    {
        $request->validate([
            'search'    => ['sometimes', 'string', 'max:255'],
            'type'      => ['sometimes', 'string', Rule::in(['percent', 'fixed'])],
            'is_active' => ['sometimes', 'boolean'],
            'per_page'  => ['sometimes', 'integer', 'between:1,100'],
        ], [], [
            'type'      => 'tipe diskon',
            'is_active' => 'status aktif',
            'per_page'  => 'jumlah per halaman',
        ]);

        $query = Promo::with($this->relations);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%");
        }

        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->exists('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $perPage = (int) $request->input('per_page', 10);

        $promos = $query->orderByDesc('id')->paginate($perPage);

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
     * Buat promo baru beserta relasi produk.
     */
    public function store(Request $request)
    {
        $validated = $request->validate(
            $this->rules(),
            $this->messages()
        );

        $promo = DB::transaction(function () use ($validated) {
            $promo = Promo::create([
                'name'         => $validated['name'],
                'type'         => $validated['type'],
                'value'        => $validated['value'],
                'starts_at'    => $validated['starts_at'],
                'ends_at'      => $validated['ends_at'],
                'is_active'    => $validated['is_active'] ?? true,
            ]);

            if (! empty($validated['product_ids'])) {
                $promo->products()->sync($validated['product_ids']);
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
                'name', 'type', 'value',
                'starts_at', 'ends_at', 'is_active',
            ])->toArray();

            if (! empty($data)) {
                $promo->update($data);
            }

            if ($request->exists('product_ids')) {
                $promo->products()->sync($validated['product_ids'] ?? []);
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
            $promo->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Promo berhasil dihapus.',
        ]);
    }

    /**
     * Aturan validasi promo.
     */
    private function rules(bool $isUpdate = false, ?int $ignoreId = null): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return [
            'name'           => [$required, 'string', 'max:255'],
            'type'           => [$required, 'string', Rule::in(['percent', 'fixed'])],
            'value'          => [$required, 'numeric', 'min:0'],
            'starts_at'      => [$required, 'date'],
            'ends_at'        => [$required, 'date', 'after:starts_at'],
            'is_active'      => ['sometimes', 'boolean'],
            'product_ids'    => ['sometimes', 'array'],
            'product_ids.*'  => ['integer', 'exists:products,id'],
        ];
    }

    /**
     * Pesan validasi dalam Bahasa Indonesia.
     */
    private function messages(): array
    {
        return [
            'name.required'       => 'Nama promo wajib diisi.',
            'name.max'            => 'Nama promo maksimal 255 karakter.',
            'type.required'       => 'Tipe diskon wajib diisi.',
            'type.in'             => 'Tipe diskon harus salah satu dari: percent, fixed.',
            'value.required'      => 'Nilai diskon wajib diisi.',
            'value.numeric'       => 'Nilai diskon harus berupa angka.',
            'value.min'           => 'Nilai diskon tidak boleh kurang dari 0.',
            'starts_at.required'  => 'Tanggal mulai promo wajib diisi.',
            'starts_at.date'      => 'Tanggal mulai harus berupa tanggal yang valid.',
            'ends_at.required'    => 'Tanggal berakhir promo wajib diisi.',
            'ends_at.date'        => 'Tanggal berakhir harus berupa tanggal yang valid.',
            'ends_at.after'       => 'Tanggal berakhir harus setelah tanggal mulai.',
            'product_ids.*.exists'  => 'Salah satu produk yang dipilih tidak ditemukan.',
        ];
    }
}
