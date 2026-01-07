import { useEffect, useState } from 'react';
import { supabase, Product, CarouselBanner } from '../lib/supabase';
import Carousel from '../components/Carousel';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

type HomePageProps = {
  onNavigate: (page: string, data?: any) => void;
};

export default function HomePage({ onNavigate }: HomePageProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [banners, setBanners] = useState<CarouselBanner[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [discountedProducts, setDiscountedProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchBanners();
    fetchProducts();
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchBanners = async () => {
    const { data } = await supabase
      .from('carousel_banners')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (data) setBanners(data);
  };

  const fetchProducts = async () => {
    const { data: featured } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .limit(8);

    const { data: newItems } = await supabase
      .from('products')
      .select('*')
      .eq('is_new_arrival', true)
      .limit(8);

    const { data: best } = await supabase
      .from('products')
      .select('*')
      .eq('is_best_seller', true)
      .limit(8);

    const { data: discounted } = await supabase
      .from('products')
      .select('*')
      .gt('discount_percentage', 0)
      .limit(8);

    if (featured) setFeaturedProducts(featured);
    if (newItems) setNewArrivals(newItems);
    if (best) setBestSellers(best);
    if (discounted) setDiscountedProducts(discounted);
  };

  const fetchWishlist = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('wishlist_items')
      .select('product_id')
      .eq('user_id', user.id);

    if (data) {
      setWishlist(new Set(data.map(item => item.product_id)));
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      onNavigate('login');
      return;
    }

    try {
      await addToCart(product.id, 1);
      alert('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  const handleToggleWishlist = async (product: Product) => {
    if (!user) {
      onNavigate('login');
      return;
    }

    const isInWishlist = wishlist.has(product.id);

    if (isInWishlist) {
      await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', product.id);

      setWishlist(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    } else {
      await supabase
        .from('wishlist_items')
        .insert({ user_id: user.id, product_id: product.id });

      setWishlist(prev => new Set(prev).add(product.id));
    }
  };

  const ProductSection = ({ title, products }: { title: string; products: Product[] }) => {
    if (products.length === 0) return null;

    return (
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={(p) => onNavigate('product', p)}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              isInWishlist={wishlist.has(product.id)}
            />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50">
      <Carousel banners={banners} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductSection title="✨ Featured Collection" products={featuredProducts} />
        <ProductSection title="🆕 New Arrivals" products={newArrivals} />
        <ProductSection title="🔥 Best Sellers" products={bestSellers} />
        <ProductSection title="💝 Special Discounts" products={discountedProducts} />

        {featuredProducts.length === 0 && newArrivals.length === 0 && bestSellers.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">
              No products available yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
