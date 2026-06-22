<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class PromoCategory extends Pivot
{
    protected $table = 'promo_categories';

    public $incrementing = false;
    public $timestamps = false;

    protected $casts = [
        'promo_id'    => 'string',
        'category_id' => 'string',
    ];

    public function promo()
    {
        return $this->belongsTo(Promo::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
