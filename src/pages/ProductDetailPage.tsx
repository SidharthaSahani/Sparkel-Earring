import { useState, useEffect } from 'react';
import { Product } from '../lib/supabase';
import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';

type ProductDetailPageProps = {
  product: Product;
  onNavigate: (page: string, data?: any) => void;
};

export default function ProductDetailPage({ product, onNavigate }: ProductDetailPageProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (user) {
      checkWishlist();
    }
  }, [user, product.id]);

  const checkWishlist = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .maybeSingle();

    setIsInWishlist(!!data);
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      onNavigate('login');
      return;
    }

    if (isInWishlist) {
      await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', product.id);

      setIsInWishlist(false);
    } else {
      await supabase
        .from('wishlist_items')
        .insert({ user_id: user.id, product_id: product.id });

      setIsInWishlist(true);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      onNavigate('login');
      return;
    }

    try {
      await addToCart(product.id, quantity, selectedColor || undefined, selectedSize || undefined);
      alert('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  const finalPrice = product.price * (1 - product.discount_percentage / 100);
  const images = product.images.length > 0 ? product.images : ['https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-gray-600 hover:text-pink-500 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div>
              <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform hover:scale-110"
                />
                {product.discount_percentage > 0 && (
                  <div className="absolute top-4 left-4 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {product.discount_percentage}% OFF
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-pink-400' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>

              <div className="flex items-center gap-3 mb-4">
                {product.discount_percentage > 0 ? (
                  <>
                    <span className="text-3xl font-bold text-pink-600">
                      ${finalPrice.toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-800">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Color</h3>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-full border-2 transition-all ${
                          selectedColor === color
                            ? 'border-pink-400 bg-pink-50'
                            : 'border-gray-300 hover:border-pink-200'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Size</h3>
                  <div className="flex gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-full border-2 transition-all ${
                          selectedSize === size
                            ? 'border-pink-400 bg-pink-50'
                            : 'border-gray-300 hover:border-pink-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Quantity</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-pink-400 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-pink-400 transition-colors"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-500 ml-4">
                    {product.stock} available
                  </span>
                </div>
              </div>

              <div className="flex gap-4 mt-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-gradient-to-r from-pink-400 to-rose-400 text-white py-3 rounded-full font-semibold hover:from-pink-500 hover:to-rose-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className="w-12 h-12 rounded-full border-2 border-pink-400 hover:bg-pink-50 transition-all flex items-center justify-center"
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-pink-500 text-pink-500' : 'text-pink-400'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
