<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promo_categories', function (Blueprint $table) {

            $table->foreignId('promo_id')->constrained('promos')->onDelete('cascade');

            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');

            $table->primary([
                'promo_id',
                'category_id'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promo_categories');
    }
};
