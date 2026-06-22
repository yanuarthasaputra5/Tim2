<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Promo extends Model
{
    protected $fillable = [
        'name',
        'type',
        'value',
        'starts_at',
        'ends_at',
        'is_active',
    ];

    protected $casts = [
        'value'        => 'decimal:2',
        'starts_at'    => 'datetime',
        'ends_at'      => 'datetime',
        'is_active'    => 'boolean',
    ];

    /**
     * Produk yang terkait dengan promo ini.
     */
    public function products()
    {
        return $this->belongsToMany(Product::class, 'promo_products');
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
     * Cek apakah promo ini valid (aktif, dalam periode).
     */
    public function isValid(): bool
    {
        return $this->is_active
            && now()->between($this->starts_at, $this->ends_at);
    }

    /**
     * Hitung besaran diskon berdasarkan tipe promo.
     */
    public function calculateDiscount(float $price): float
    {
        switch ($this->type) {
            case 'percent':
                $discount = $price * ((float) $this->value / 100);
                return round($discount, 2);

            case 'fixed':
                return min((float) $this->value, $price);
        }

        return 0;
    }
}
