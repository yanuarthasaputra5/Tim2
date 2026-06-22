<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promo_products', function (Blueprint $table) {

            $table->uuid('promo_id');
            $table->uuid('product_id');

            $table->primary(['promo_id', 'product_id']);

            $table->foreign('promo_id')->references('id')->on('promos')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promo_products');
    }
};
