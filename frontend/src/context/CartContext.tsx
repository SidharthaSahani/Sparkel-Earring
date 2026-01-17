import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartItem, Product } from '../types/types';
import { useAuth } from './AuthContext';
import toastService from '../utils/toastService';

type CartContextType = {
  cartItems: (CartItem & { product: Product })[];
  cartCount: number;
  loading: boolean;
  addToCart: (productId: string, quantity: number, color?: string, size?: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<(CartItem & { product: Product })[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const refreshCart = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get cart items from localStorage
      const storedCart = localStorage.getItem(`cart_${user.id}`);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number, color?: string, size?: string) => {
    if (!user) {
      toastService.error('You must be logged in to add items to your cart');
      throw new Error('Must be logged in to add to cart');
    }

    // Get current cart items
    const storedCart = localStorage.getItem(`cart_${user.id}`);
    const currentCart: (CartItem & { product: Product })[] = storedCart ? JSON.parse(storedCart) : [];

    // Check if item already exists in cart with same color/size
    const existingItemIndex = currentCart.findIndex(
      item => 
        item.product_id === productId && 
        item.selected_color === (color || null) && 
        item.selected_size === (size || null)
    );

    if (existingItemIndex > -1) {
      // Update existing item quantity
      currentCart[existingItemIndex].quantity += quantity;
      toastService.info(`Updated quantity in cart. New quantity: ${currentCart[existingItemIndex].quantity}`);
    } else {
      // Add new item to cart
      // In a real implementation, you'd fetch the actual product details
      const newItem: (CartItem & { product: Product }) = {
        id: Date.now().toString(),
        user_id: user.id,
        product_id: productId,
        quantity,
        selected_color: color || null,
        selected_size: size || null,
        created_at: new Date().toISOString(),
        product: {
          id: productId,
          name: 'Product Name', // This would be fetched in a real app
          slug: 'product-slug',
          description: 'Product description',
          price: 0,
          category_id: 'category',
          images: [],
          colors: [],
          sizes: [],
          stock: 0,
          is_featured: false,
          is_new_arrival: false,
          is_best_seller: false,
          discount_percentage: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      };
      currentCart.push(newItem);
      toastService.success('Item added to cart successfully!');
    }

    // Save updated cart to localStorage
    localStorage.setItem(`cart_${user.id}`, JSON.stringify(currentCart));
    setCartItems(currentCart);
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    if (!user) {
      toastService.error('You must be logged in to update cart items');
      return;
    }

    // Get current cart items
    const storedCart = localStorage.getItem(`cart_${user.id}`);
    const currentCart: (CartItem & { product: Product })[] = storedCart ? JSON.parse(storedCart) : [];

    // Find and update the item
    const itemIndex = currentCart.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
      currentCart[itemIndex].quantity = quantity;
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(currentCart));
      setCartItems(currentCart);
      toastService.info(`Quantity updated to ${quantity}`);
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) {
      toastService.error('You must be logged in to remove items from cart');
      return;
    }

    // Get current cart items
    const storedCart = localStorage.getItem(`cart_${user.id}`);
    const currentCart: (CartItem & { product: Product })[] = storedCart ? JSON.parse(storedCart) : [];

    // Filter out the item to remove
    const updatedCart = currentCart.filter(item => item.id !== itemId);
    
    // Save updated cart to localStorage
    localStorage.setItem(`cart_${user.id}`, JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    
    toastService.info('Item removed from cart');
  };

  const clearCart = async () => {
    if (!user) return;

    // Clear cart in localStorage
    localStorage.removeItem(`cart_${user.id}`);
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      refreshCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
