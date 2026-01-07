import { useCart } from '../contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

type CartPageProps = {
  onNavigate: (page: string, data?: any) => void;
};

export default function CartPage({ onNavigate }: CartPageProps) {
  const { cartItems, updateQuantity, removeFromCart, cartCount } = useCart();

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product.price * (1 - item.product.discount_percentage / 100);
    return sum + price * item.quantity;
  }, 0);

  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some beautiful jewelry to your cart!</p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-gradient-to-r from-pink-400 to-rose-400 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-500 hover:to-rose-500 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const price = item.product.price * (1 - item.product.discount_percentage / 100);
              return (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex gap-4">
                    <img
                      src={item.product.images[0] || 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg'}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{item.product.name}</h3>

                      {item.selected_color && (
                        <p className="text-sm text-gray-600">Color: {item.selected_color}</p>
                      )}
                      {item.selected_size && (
                        <p className="text-sm text-gray-600">Size: {item.selected_size}</p>
                      )}

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-pink-400 flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-pink-400 flex items-center justify-center transition-colors disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-600 p-2 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-800">
                        ${(price * item.quantity).toFixed(2)}
                      </p>
                      {item.product.discount_percentage > 0 && (
                        <p className="text-sm text-gray-400 line-through">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-sm text-pink-600">
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold text-gray-800">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('checkout')}
                className="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white py-3 rounded-full font-semibold hover:from-pink-500 hover:to-rose-500 transition-all"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => onNavigate('home')}
                className="w-full mt-3 border-2 border-gray-300 text-gray-700 py-3 rounded-full font-semibold hover:border-pink-400 hover:text-pink-500 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
