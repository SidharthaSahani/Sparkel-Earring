import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../lib/supabase';

type ProductCardProps = {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isInWishlist?: boolean;
};

export default function ProductCard({
  product,
  onViewDetails,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false,
}: ProductCardProps) {
  const finalPrice = product.price * (1 - product.discount_percentage / 100);

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-xl">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.images[0] || 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {product.discount_percentage > 0 && (
          <div className="absolute top-2 left-2 bg-rose-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {product.discount_percentage}% OFF
          </div>
        )}

        {product.is_new_arrival && (
          <div className="absolute top-2 right-2 bg-pink-400 text-white px-2 py-1 rounded-full text-xs font-semibold">
            NEW
          </div>
        )}

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={() => onViewDetails(product)}
            className="bg-white text-gray-800 px-6 py-2 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
          >
            Quick View
          </button>
        </div>

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onToggleWishlist && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product);
              }}
              className="bg-white p-2 rounded-full shadow-md hover:bg-pink-50 transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${isInWishlist ? 'fill-pink-500 text-pink-500' : 'text-gray-600'}`}
              />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {product.discount_percentage > 0 ? (
              <>
                <span className="text-lg font-bold text-pink-600">
                  ${finalPrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-800">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {product.stock < 10 && product.stock > 0 && (
            <span className="text-xs text-orange-500 font-medium">
              Only {product.stock} left
            </span>
          )}
        </div>

        {onAddToCart && (
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white py-2 rounded-full font-medium hover:from-pink-500 hover:to-rose-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
}
