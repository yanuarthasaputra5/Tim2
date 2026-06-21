<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;

class GenerateProductSeeder extends Command
{
    /**
     * Jalankan: php artisan seeder:generate-products
     */
    protected $signature = 'seeder:generate-products';

    protected $description = 'Generate database/seeders/ProductSeeder.php dari data produk yang ada saat ini di database';

    public function handle(): void
    {
        $products = Product::with(['variants', 'images', 'categories', 'status'])->get();

        if ($products->isEmpty()) {
            $this->error('Tidak ada data produk di database. Tidak ada yang di-generate.');
            return;
        }

        $data = $products->map(function (Product $product) {
            return [
                'name'        => $product->name,
                'slug'        => $product->slug,
                'description' => $product->description,
                'price'       => (string) $product->price,
                'stock'       => $product->stock,
                'status'      => $product->status?->name_status,

                'categories' => $product->categories->map(fn ($c) => [
                    'name'   => $c->name,
                    'slug'   => $c->slug,
                    'status' => $c->status?->name_status,
                ])->all(),

                'variants' => $product->variants->map(fn ($v) => [
                    'name'   => $v->name,
                    'price'  => (string) $v->price,
                    'stock'  => $v->stock,
                    'status' => $v->status?->name_status,
                ])->all(),

                'images' => $product->images->map(fn ($img) => [
                    'url'        => $img->url,
                    'is_primary' => $img->is_primary,
                    'sort_order' => $img->sort_order,
                ])->all(),
            ];
        })->all();

        $export = var_export($data, true);

        $stub = <<<PHP
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
        \$products = $export;

        foreach (\$products as \$item) {
            \$status = Status::where('name_status', \$item['status'])
                ->where('type_status', 'product')
                ->first();

            \$product = Product::firstOrCreate(
                ['slug' => \$item['slug']],
                [
                    'name'        => \$item['name'],
                    'description' => \$item['description'],
                    'price'       => \$item['price'],
                    'stock'       => \$item['stock'],
                    'status_id'   => \$status?->id,
                ]
            );

            // Kategori
            \$categoryIds = [];
            foreach (\$item['categories'] as \$cat) {
                \$catStatus = Status::where('name_status', \$cat['status'])
                    ->where('type_status', 'categories')
                    ->first();

                \$category = Category::firstOrCreate(
                    ['slug' => \$cat['slug']],
                    [
                        'name'      => \$cat['name'],
                        'status_id' => \$catStatus?->id,
                    ]
                );

                \$categoryIds[] = \$category->id;
            }
            \$product->categories()->syncWithoutDetaching(\$categoryIds);

            // Variant
            foreach (\$item['variants'] as \$variant) {
                \$variantStatus = Status::where('name_status', \$variant['status'])
                    ->where('type_status', 'product')
                    ->first();

                \$product->variants()->firstOrCreate(
                    ['name' => \$variant['name']],
                    [
                        'price'     => \$variant['price'],
                        'stock'     => \$variant['stock'],
                        'status_id' => \$variantStatus?->id,
                    ]
                );
            }

            // Gambar
            foreach (\$item['images'] as \$image) {
                \$product->images()->firstOrCreate(
                    ['url' => \$image['url']],
                    [
                        'is_primary' => \$image['is_primary'],
                        'sort_order' => \$image['sort_order'],
                    ]
                );
            }
        }
    }
}

PHP;

        $path = database_path('seeders/ProductSeeder.php');
        file_put_contents($path, $stub);

        $this->info("ProductSeeder.php berhasil digenerate dari {$products->count()} produk.");
        $this->info("Lokasi: {$path}");
        $this->warn('Jangan lupa tambahkan ProductSeeder::class ke DatabaseSeeder.php');
    }
}