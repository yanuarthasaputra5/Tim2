<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promo_products', function (Blueprint $table) {

            $table->foreignId('promo_id')->constrained('promos')->onDelete('cascade');

            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');

            $table->primary([
                'promo_id',
                'product_id'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promo_products');
    }
};
