import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import toastService from '../utils/toastService';

interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
}

type WishlistContextType = {
  wishlistItems: (WishlistItem & { product: Product })[];
  wishlistCount: number;
  loading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<(WishlistItem & { product: Product })[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      refreshWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const refreshWishlist = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get wishlist items from localStorage
      const storedWishlist = localStorage.getItem(`wishlist_${user.id}`);
      if (storedWishlist) {
        setWishlistItems(JSON.parse(storedWishlist));
      } else {
        setWishlistItems([]);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    if (!user) {
      toastService.error('You must be logged in to add items to your wishlist');
      return;
    }

    // Get current wishlist items
    const storedWishlist = localStorage.getItem(`wishlist_${user.id}`);
    const currentWishlist: (WishlistItem & { product: Product })[] = storedWishlist ? JSON.parse(storedWishlist) : [];

    // Check if item already exists in wishlist
    const existingItemIndex = currentWishlist.findIndex(
      item => item.product_id === productId
    );

    if (existingItemIndex === -1) {
      // Add new item to wishlist
      const newItem: (WishlistItem & { product: Product }) = {
        id: Date.now().toString(),
        user_id: user.id,
        product_id: productId,
        created_at: new Date().toISOString(),
        product: {
          id: productId,
          name: 'Product Name', // This would be fetched in a real app
          price: 0,
          images: [],
        }
      };
      currentWishlist.push(newItem);
      toastService.success('Item added to wishlist successfully!');
    } else {
      toastService.info('Item is already in your wishlist');
      return;
    }

    // Save updated wishlist to localStorage
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(currentWishlist));
    setWishlistItems(currentWishlist);
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) {
      toastService.error('You must be logged in to remove items from wishlist');
      return;
    }

    // Get current wishlist items
    const storedWishlist = localStorage.getItem(`wishlist_${user.id}`);
    const currentWishlist: (WishlistItem & { product: Product })[] = storedWishlist ? JSON.parse(storedWishlist) : [];

    // Filter out the item to remove
    const updatedWishlist = currentWishlist.filter(item => item.product_id !== productId);
    
    // Save updated wishlist to localStorage
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updatedWishlist));
    setWishlistItems(updatedWishlist);
    
    toastService.info('Item removed from wishlist');
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      wishlistCount: wishlistItems.length,
      loading,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      refreshWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}