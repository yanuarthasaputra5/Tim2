<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Status;
use Illuminate\Database\Seeder;

/**
 * File ini di-generate otomatis dari data produk yang ada di database.
 * Generate ulang dengan: php artisan seeder:generate-products
 */
class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = array (
  0 => 
  array (
    'name' => 'SIBER Phoenix Edition',
    'slug' => 'siber-phoenix-edition',
    'description' => '"Kaos hitam dengan desain burung phoenix warna emas-merah"
Kaos eksklusif dengan desain burung phoenix yang melambangkan kekuatan, perubahan, dan semangat untuk terus berkembang.',
    'price' => '75000.00',
    'stock' => 60,
    'status' => 'Aktif',
    'categories' => 
    array (
      0 => 
      array (
        'name' => 'T-Shirt',
        'slug' => 't-shirt',
        'status' => 'Aktif',
      ),
    ),
    'variants' => 
    array (
      0 => 
      array (
        'name' => 'S - Lengan pendek',
        'price' => '75000.00',
        'stock' => 5,
        'status' => 'Aktif',
      ),
      1 => 
      array (
        'name' => 'S - Lengan panjang',
        'price' => '85000.00',
        'stock' => 5,
        'status' => 'Aktif',
      ),
      2 => 
      array (
        'name' => 'M - Lengan pendek',
        'price' => '75000.00',
        'stock' => 5,
        'status' => 'Aktif',
      ),
      3 => 
      array (
        'name' => 'M - Lengan panjang',
        'price' => '85000.00',
        'stock' => 5,
        'status' => 'Aktif',
      ),
      4 => 
      array (
        'name' => 'L - Lengan pendek',
        'price' => '75000.00',
        'stock' => 5,
        'status' => 'Aktif',
      ),
      5 => 
      array (
        'name' => 'L - Lengan panjang',
        'price' => '85000.00',
        'stock' => 5,
        'status' => 'Aktif',
      ),
      6 => 
      array (
        'name' => 'XL - Lengan pendek',
        'price' => '75000.00',
        'stock' => 5,
        'status' => 'Aktif',
      ),
      7 => 
      array (
        'name' => 'XL - Lengan panjang',
        'price' => '85000.00',
        'stock' => 5,
        'status' => 'Aktif',
      ),
      8 => 
      array (
        'name' => 'XXL - Lengan pendek',
        'price' => '80000.00',
        'stock' => 5,
        'status' => 'Aktif',
      ),
      9 => 
      array (
        'name' => 'XXL - Lengan panjang',
        'price' => '90000.00',
        'stock' => 15,
        'status' => 'Aktif',
      ),
    ),
    'images' => 
    array (
      0 => 
      array (
        'url' => '/storage/products/BHlp6FFU1iri5p4gMQ7PbCul0SSyBeBg3O8zOFKH.jpg',
        'is_primary' => true,
        'sort_order' => 0,
      ),
    ),
  ),
  1 => 
  array (
    'name' => 'SIBER Kartun Edition',
    'slug' => 'siber-kartun-edition',
    'description' => 'Whatever You Said, I\'m SIBER Anyways : Kaos modern dengan ilustrasi kartun unik dan tipografi kreatif yang mencerminkan identitas mahasiswa Sistem Informasi yang santai, percaya diri, dan penuh semangat.',
    'price' => '75000.00',
    'stock' => 100,
    'status' => 'Aktif',
    'categories' => 
    array (
      0 => 
      array (
        'name' => 'T-Shirt',
        'slug' => 't-shirt',
        'status' => 'Aktif',
      ),
    ),
    'variants' => 
    array (
      0 => 
      array (
        'name' => 'S - Lengan pendek',
        'price' => '75000.00',
        'stock' => 10,
        'status' => 'Aktif',
      ),
      1 => 
      array (
        'name' => 'S - Lengan panjang',
        'price' => '80000.00',
        'stock' => 10,
        'status' => 'Aktif',
      ),
      2 => 
      array (
        'name' => 'M - Lengan pendek',
        'price' => '75000.00',
        'stock' => 10,
        'status' => 'Aktif',
      ),
      3 => 
      array (
        'name' => 'M - Lengan panjang',
        'price' => '80000.00',
        'stock' => 10,
        'status' => 'Aktif',
      ),
      4 => 
      array (
        'name' => 'L - Lengan pendek',
        'price' => '75000.00',
        'stock' => 10,
        'status' => 'Aktif',
      ),
      5 => 
      array (
        'name' => 'L - Lengan panjang',
        'price' => '80000.00',
        'stock' => 10,
        'status' => 'Aktif',
      ),
      6 => 
      array (
        'name' => 'XL - Lengan pendek',
        'price' => '75000.00',
        'stock' => 10,
        'status' => 'Aktif',
      ),
      7 => 
      array (
        'name' => 'XL - Lengan panjang',
        'price' => '80000.00',
        'stock' => 10,
        'status' => 'Aktif',
      ),
      8 => 
      array (
        'name' => 'XXL - Lengan pendek',
        'price' => '85000.00',
        'stock' => 10,
        'status' => 'Aktif',
      ),
      9 => 
      array (
        'name' => 'XXL - Lengan panjang',
        'price' => '90000.00',
        'stock' => 10,
        'status' => 'Aktif',
      ),
    ),
    'images' => 
    array (
      0 => 
      array (
        'url' => '/storage/products/Jb1PXTpdbVJ5VUIkKCULC4QF7k2GCa35WvsetXzY.jpg',
        'is_primary' => true,
        'sort_order' => 0,
      ),
    ),
  ),
);

        foreach ($products as $item) {
            $status = Status::where('name_status', $item['status'])
                ->where('type_status', 'product')
                ->first();

            $product = Product::firstOrCreate(
                ['slug' => $item['slug']],
                [
                    'name'        => $item['name'],
                    'description' => $item['description'],
                    'price'       => $item['price'],
                    'stock'       => $item['stock'],
                    'status_id'   => $status?->id,
                ]
            );

            // Kategori
            $categoryIds = [];
            foreach ($item['categories'] as $cat) {
                $catStatus = Status::where('name_status', $cat['status'])
                    ->where('type_status', 'categories')
                    ->first();

                $category = Category::firstOrCreate(
                    ['slug' => $cat['slug']],
                    [
                        'name'      => $cat['name'],
                        'status_id' => $catStatus?->id,
                    ]
                );

                $categoryIds[] = $category->id;
            }
            $product->categories()->syncWithoutDetaching($categoryIds);

            // Variant
            foreach ($item['variants'] as $variant) {
                $variantStatus = Status::where('name_status', $variant['status'])
                    ->where('type_status', 'product')
                    ->first();

                $product->variants()->firstOrCreate(
                    ['name' => $variant['name']],
                    [
                        'price'     => $variant['price'],
                        'stock'     => $variant['stock'],
                        'status_id' => $variantStatus?->id,
                    ]
                );
            }

            // Gambar
            foreach ($item['images'] as $image) {
                $product->images()->firstOrCreate(
                    ['url' => $image['url']],
                    [
                        'is_primary' => $image['is_primary'],
                        'sort_order' => $image['sort_order'],
                    ]
                );
            }
        }
    }
}
