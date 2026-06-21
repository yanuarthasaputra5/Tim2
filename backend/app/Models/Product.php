<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'stock',
        'status_id'
    ];

    protected $appends = ['discounted_price', 'active_promo'];

    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
    ];

    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class,'product_categories');
    }

    public function promos()
    {
        return $this->belongsToMany(Promo::class, 'promo_products');
    }

    public function getActivePromoAttribute()
    {
        return $this->promos()
            ->where('is_active', true)
            ->where('starts_at', '<=', now())
            ->where('ends_at', '>=', now())
            ->first();
    }

    public function getDiscountedPriceAttribute()
    {
        $promo = $this->active_promo;
        if (!$promo) {
            return (float) $this->price;
        }

        if ($promo->type === 'percent') {
            $discount = (float) $this->price * ($promo->value / 100);
            return (float) max(0, $this->price - $discount);
        } elseif ($promo->type === 'fixed') {
            return (float) max(0, $this->price - $promo->value);
        }

        return (float) $this->price;
    }
}