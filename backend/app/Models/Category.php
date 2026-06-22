<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasUuids;

    public $timestamps = false;

    protected $fillable = [
        'parent_id',
        'name',
        'slug',
        'image_url',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Kategori induk (parent).
     */
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
     * Sub-kategori (children).
     */
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    /**
     * Produk yang termasuk dalam kategori ini.
     */
    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_categories');
    }

    /**
     * Promo yang berlaku untuk kategori ini.
     */
    public function promos()
    {
        return $this->belongsToMany(Promo::class, 'promo_categories');
    }
}