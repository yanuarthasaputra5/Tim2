<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Support\SlugGenerator;
use Illuminate\Database\Seeder;

class DummyProductSeeder extends Seeder
{
    public function run(): void
    {
        $statusProductAktif = 1;
        $statusCategoryAktif = 4;

        // ==================== CATEGORIES ====================
        $categories = [
            ['name' => 'Kaos', 'slug' => SlugGenerator::generate('Kaos', 'categories'), 'status_id' => $statusCategoryAktif],
            ['name' => 'Hoodie', 'slug' => SlugGenerator::generate('Hoodie', 'categories'), 'status_id' => $statusCategoryAktif],
        ];

        foreach ($categories as $data) {
            Category::firstOrCreate(['name' => $data['name']], $data);
        }

        $kaosCat = Category::where('name', 'Kaos')->first();
        $hoodieCat = Category::where('name', 'Hoodie')->first();

        // ==================== PRODUCT 1: Kaos Oversize ====================
        $product1 = Product::firstOrCreate(
            ['name' => 'Kaos Oversize SIBER'],
            [
                'slug' => SlugGenerator::generate('Kaos Oversize SIBER', 'products'),
                'description' => 'Kaos oversize premium dengan bahan cotton combed 24s. Nyaman dipakai sehari-hari dengan potongan longgar yang trendi.',
                'price' => 85000,
                'stock' => 50,
                'status_id' => $statusProductAktif,
            ]
        );

        $product1->categories()->syncWithoutDetaching([$kaosCat->id]);

        ProductVariant::firstOrCreate(
            ['product_id' => $product1->id, 'name' => 'S - Hitam'],
            ['price' => 85000, 'stock' => 15, 'status_id' => $statusProductAktif]
        );
        ProductVariant::firstOrCreate(
            ['product_id' => $product1->id, 'name' => 'M - Hitam'],
            ['price' => 85000, 'stock' => 20, 'status_id' => $statusProductAktif]
        );
        ProductVariant::firstOrCreate(
            ['product_id' => $product1->id, 'name' => 'L - Hitam'],
            ['price' => 85000, 'stock' => 15, 'status_id' => $statusProductAktif]
        );

        // ==================== PRODUCT 2: Hoodie SIBER ====================
        $product2 = Product::firstOrCreate(
            ['name' => 'Hoodie SIBER'],
            [
                'slug' => SlugGenerator::generate('Hoodie SIBER', 'products'),
                'description' => 'Hoodie premium dengan bahan fleece tebal dan hangat. Cocok untuk kegiatan outdoor maupun santai.',
                'price' => 150000,
                'stock' => 30,
                'status_id' => $statusProductAktif,
            ]
        );

        $product2->categories()->syncWithoutDetaching([$hoodieCat->id]);

        ProductVariant::firstOrCreate(
            ['product_id' => $product2->id, 'name' => 'M - Abu'],
            ['price' => 150000, 'stock' => 10, 'status_id' => $statusProductAktif]
        );
        ProductVariant::firstOrCreate(
            ['product_id' => $product2->id, 'name' => 'L - Abu'],
            ['price' => 150000, 'stock' => 12, 'status_id' => $statusProductAktif]
        );
        ProductVariant::firstOrCreate(
            ['product_id' => $product2->id, 'name' => 'XL - Abu'],
            ['price' => 155000, 'stock' => 8, 'status_id' => $statusProductAktif]
        );

        $this->command->info('2 produk dummy berhasil dibuat!');
    }
}
