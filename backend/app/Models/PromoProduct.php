<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class PromoProduct extends Pivot
{
    protected $table = 'promo_products';

    public $incrementing = false;
    public $timestamps = false;

    protected $casts = [
        'promo_id'   => 'string',
        'product_id' => 'string',
    ];

    public function promo()
    {
        return $this->belongsTo(Promo::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
