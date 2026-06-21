import { useState, useEffect } from 'react';
import HeroSection from '../HeroSection';
import AboutSection from '../AboutSection';
import ProductSection from '../ProductSection';
import ProductDetailModal from '../../components/ProductDetailModal';
import { getProducts } from '../../services/productService';

export default function CustomerHomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [activeQuickView, setActiveQuickView] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts({ per_page: 100 });
      const raw = Array.isArray(res.data?.data?.data)
        ? res.data.data.data
        : [];

      const formatted = raw.map(product => ({
        ...product,
        category: product.categories?.[0]?.name || 'Produk',
        badgeText: product.badge || (product.active_promo ? 'DISKON' : 'SIBER'),
        rating: 5,
        reviews: 0,
      }));

      setProducts(formatted);
    } catch {
      setProducts([]);
    }
  };

  const scrollToId = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <HeroSection scrollToId={scrollToId} />
      <AboutSection />
      <ProductSection
        products={products}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onQuickView={(product) => setActiveQuickView(product)}
      />
      {activeQuickView && (
        <ProductDetailModal
          product={activeQuickView}
          onClose={() => setActiveQuickView(null)}
        />
      )}
    </>
  );
}
