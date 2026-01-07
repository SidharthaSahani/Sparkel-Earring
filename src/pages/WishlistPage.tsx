import { useEffect, useState } from 'react';
import { supabase, Product } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';

type WishlistPageProps = {
  onNavigate: (page: string, data?: any) => void;
};

export default function WishlistPage({ onNavigate }: WishlistPageProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;

    setLoading(true);
    const { data } = await supabase
      .from('wishlist_items')
      .select('product:products(*)')
      .eq('user_id', user.id);

    if (data) {
      setWishlistItems(data.map((item: any) => item.product).filter(Boolean));
    }
    setLoading(false);
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!user) return;

    await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    setWishlistItems(prev => prev.filter(p => p.id !== productId));
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">Save your favorite items for later!</p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-gradient-to-r from-pink-400 to-rose-400 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-500 hover:to-rose-500 transition-all"
          >
            Explore Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Wishlist</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map(product => (
            <div key={product.id}>
              <ProductCard
                product={product}
                onViewDetails={(p) => onNavigate('product', p)}
                onAddToCart={handleAddToCart}
                onToggleWishlist={() => handleRemoveFromWishlist(product.id)}
                isInWishlist={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
