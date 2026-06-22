<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id',
        'name',
        'price',
        'stock',
        'status_id'
    ];

    protected $appends = ['discounted_price'];

    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    public function getDiscountedPriceAttribute()
    {
        $product = $this->product;
        if (!$product) {
            return (float) $this->price;
        }

        $promo = $product->active_promo;
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