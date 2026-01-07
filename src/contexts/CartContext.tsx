import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, CartItem, Product } from '../lib/supabase';
import { useAuth } from './AuthContext';

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
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, product:products(*)')
        .eq('user_id', user.id);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number, color?: string, size?: string) => {
    if (!user) throw new Error('Must be logged in to add to cart');

    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .eq('selected_color', color || null)
      .eq('selected_size', size || null)
      .maybeSingle();

    if (existingItem) {
      await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id);
    } else {
      await supabase.from('cart_items').insert({
        user_id: user.id,
        product_id: productId,
        quantity,
        selected_color: color || null,
        selected_size: size || null,
      });
    }

    await refreshCart();
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);

    await refreshCart();
  };

  const removeFromCart = async (itemId: string) => {
    await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    await refreshCart();
  };

  const clearCart = async () => {
    if (!user) return;

    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    await refreshCart();
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
