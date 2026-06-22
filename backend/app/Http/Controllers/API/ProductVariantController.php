<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProductVariantController extends Controller
{
    /**
     * Tambah varian untuk produk.
     */
    public function store(Request $request, string $product)
    {
        $product = Product::findOrFail($product);

        $validated = $request->validate(
            $this->rules(),
            $this->messages()
        );

        $variant = $product->variants()->create($validated);

        return response()->json([
            'success' => true,
            'data'    => $variant,
        ], 201);
    }

    /**
     * Perbarui varian milik produk.
     */
    public function update(Request $request, string $product, string $variant)
    {
        $product = Product::findOrFail($product);
        $variant = $product->variants()->findOrFail($variant);

        $validated = $request->validate(
            $this->rules(true, $variant->id),
            $this->messages()
        );

        $variant->update($validated);

        return response()->json([
            'success' => true,
            'data'    => $variant,
        ]);
    }

    /**
     * Hapus varian milik produk.
     */
    public function destroy(string $product, string $variant)
    {
        $product = Product::findOrFail($product);
        $variant = $product->variants()->findOrFail($variant);

        $variant->delete();

        return response()->json([
            'success' => true,
            'message' => 'Varian produk berhasil dihapus.',
        ]);
    }

    private function rules(bool $isUpdate = false, ?string $ignoreId = null): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        $skuUnique = $ignoreId
            ? Rule::unique('product_variants', 'sku')->ignore($ignoreId)
            : Rule::unique('product_variants', 'sku');

        return [
            'name'      => [$required, 'string', 'max:100'],
            'sku'       => [$required, 'string', 'max:100', $skuUnique],
            'price'     => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'stock'     => [$required, 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    private function messages(): array
    {
        return [
            'name.required'      => 'Nama varian wajib diisi.',
            'name.max'           => 'Nama varian maksimal 100 karakter.',
            'sku.required'       => 'SKU varian wajib diisi.',
            'sku.max'            => 'SKU varian maksimal 100 karakter.',
            'sku.unique'         => 'SKU varian sudah digunakan.',
            'price.numeric'      => 'Harga varian harus berupa angka.',
            'price.min'          => 'Harga varian tidak boleh kurang dari 0.',
            'stock.required'     => 'Stok varian wajib diisi.',
            'stock.integer'      => 'Stok varian harus berupa bilangan bulat.',
            'stock.min'          => 'Stok varian tidak boleh kurang dari 0.',
        ];
    }
}
