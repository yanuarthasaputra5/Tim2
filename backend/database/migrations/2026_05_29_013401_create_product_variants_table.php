<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {

            $table->uuid('id')->primary();
            $table->uuid('product_id');
            $table->string('name', 100)->comment('contoh: Merah - L, Hitam - XL');
            $table->string('sku', 100)->unique();
            $table->decimal('price', 15, 2)->nullable()->comment('override harga jika beda');
            $table->integer('stock')->default(0);
            $table->boolean('is_active')->default(true);

            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};