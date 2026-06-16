<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Promo extends Model
{
    protected $fillable = [
        'code',
        'name',
        'scope',
        'type',
        'value',
        'min_order',
        'max_discount',
        'max_usage',
        'used_count',
        'starts_at',
        'ends_at',
        'is_active',
    ];

    protected $casts = [
        'value'        => 'decimal:2',
        'min_order'    => 'decimal:2',
        'max_discount' => 'decimal:2',
        'max_usage'    => 'integer',
        'used_count'   => 'integer',
        'starts_at'    => 'datetime',
        'ends_at'      => 'datetime',
        'is_active'    => 'boolean',
    ];

    /**
     * Produk yang terkait dengan promo ini (scope = product).
     */
    public function products()
    {
        return $this->belongsToMany(Product::class, 'promo_products');
    }

    /**
     * Kategori yang terkait dengan promo ini (scope = category).
     */
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'promo_categories');
    }

    /**
     * Scope query: hanya promo yang aktif dan dalam periode berlaku.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
                     ->where('starts_at', '<=', now())
                     ->where('ends_at', '>=', now());
    }

    /**
     * Cek apakah promo ini valid (aktif, dalam periode, belum melebihi max_usage).
     */
    public function isValid(): bool
    {
        return $this->is_active
            && now()->between($this->starts_at, $this->ends_at)
            && $this->used_count < $this->max_usage;
    }

    /**
     * Cek apakah promo berlaku untuk produk tertentu.
     */
    public function isApplicableToProducts(array $productIds): bool
    {
        if ($this->scope === 'all') {
            return true;
        }

        if ($this->scope === 'product') {
            $promoProductIds = $this->products()->pluck('products.id')->toArray();
            return count(array_intersect($productIds, $promoProductIds)) > 0;
        }

        if ($this->scope === 'category') {
            $promoCategoryIds = $this->categories()->pluck('categories.id')->toArray();

            return Product::whereIn('id', $productIds)
                ->whereHas('categories', function ($q) use ($promoCategoryIds) {
                    $q->whereIn('categories.id', $promoCategoryIds);
                })
                ->exists();
        }

        return false;
    }

    /**
     * Hitung besaran diskon berdasarkan tipe promo.
     */
    public function calculateDiscount(float $orderTotal): float
    {
        if ($orderTotal < (float) $this->min_order) {
            return 0;
        }

        switch ($this->type) {
            case 'percent':
                $discount = $orderTotal * ((float) $this->value / 100);

                if ($this->max_discount !== null && $discount > (float) $this->max_discount) {
                    $discount = (float) $this->max_discount;
                }

                return round($discount, 2);

            case 'fixed':
                return min((float) $this->value, $orderTotal);

            case 'free_shipping':
                return 0; // free_shipping ditangani di layer ongkir
        }

        return 0;
    }
}
