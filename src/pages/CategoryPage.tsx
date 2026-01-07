import { useEffect, useState } from 'react';
import { supabase, Product, Category } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { SlidersHorizontal } from 'lucide-react';

type CategoryPageProps = {
  categorySlug: string;
  onNavigate: (page: string, data?: any) => void;
};

export default function CategoryPage({ categorySlug, onNavigate }: CategoryPageProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCategory();
    fetchProducts();
    if (user) {
      fetchWishlist();
    }
  }, [categorySlug, user]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, sortBy, priceRange]);

  const fetchCategory = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', categorySlug)
      .maybeSingle();

    if (data) setCategory(data);
  };

  const fetchProducts = async () => {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle();

    if (!cat) return;

    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', cat.id);

    if (data) {
      setProducts(data);
      const maxPrice = Math.max(...data.map(p => p.price), 1000);
      setPriceRange([0, maxPrice]);
    }
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

  const filterAndSortProducts = () => {
    let filtered = products.filter(
      p => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => (b.is_best_seller ? 1 : 0) - (a.is_best_seller ? 1 : 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    setFilteredProducts(filtered);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {category?.name || 'Products'}
          </h1>
          <p className="text-gray-600">{filteredProducts.length} products found</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-64 flex-shrink-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden w-full flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm mb-4"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters & Sort
            </button>

            <div className={`bg-white p-6 rounded-lg shadow-md ${showFilters ? 'block' : 'hidden md:block'}`}>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
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
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-md">
                <p className="text-xl text-gray-600">No products found in this category</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
