<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promo_categories', function (Blueprint $table) {

            $table->uuid('promo_id');
            $table->uuid('category_id');

            $table->primary(['promo_id', 'category_id']);

            $table->foreign('promo_id')->references('id')->on('promos')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promo_categories');
    }
};
