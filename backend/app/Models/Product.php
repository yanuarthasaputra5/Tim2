<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'weight_gram',
        'stock',
        'is_active',
    ];

    protected $casts = [
        'price'      => 'decimal:2',
        'weight_gram' => 'integer',
        'stock'      => 'integer',
        'is_active'  => 'boolean',
    ];

    /**
     * Varian produk.
     */
    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    /**
     * Gambar produk.
     */
    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    /**
     * Kategori produk (many-to-many).
     */
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'product_categories');
    }

    /**
     * Promo yang berlaku untuk produk ini.
     */
    public function promos()
    {
        return $this->belongsToMany(Promo::class, 'promo_products');
    }
}