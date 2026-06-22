<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promos', function (Blueprint $table) {

            $table->uuid('id')->primary();
            $table->string('code', 50)->unique();
            $table->string('name', 255)->nullable();
            $table->string('scope', 20)->default('all');          // all, product, category
            $table->string('type', 20);                            // percent, fixed, free_shipping
            $table->decimal('value', 15, 2);
            $table->decimal('min_order', 15, 2)->default(0);
            $table->decimal('max_discount', 15, 2)->nullable();    // batas max diskon untuk tipe percent
            $table->integer('max_usage')->default(1);
            $table->integer('used_count')->default(0);
            $table->timestamp('starts_at');
            $table->timestamp('ends_at');
            $table->boolean('is_active')->default(true);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promos');
    }
};
