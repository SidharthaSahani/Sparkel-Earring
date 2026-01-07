import { useState } from 'react';
import { Search, ShoppingCart, Heart, User, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

type NavbarProps = {
  onNavigate: (page: string) => void;
  currentPage: string;
};

export default function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const { user, profile, signOut } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const categories = [
    { name: 'Earrings', slug: 'earrings' },
    { name: 'Necklaces', slug: 'necklaces' },
    { name: 'Rings', slug: 'rings' },
    { name: 'Bracelets', slug: 'bracelets' },
    { name: 'Accessories', slug: 'accessories' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={() => onNavigate('home')}
            className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            ✨ Sparkle & Shine
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => onNavigate(`category-${category.slug}`)}
                className={`text-gray-700 hover:text-pink-500 transition-colors font-medium ${
                  currentPage === `category-${category.slug}` ? 'text-pink-500' : ''
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Search className="w-5 h-5 text-gray-700" />
            </button>

            {user && (
              <button
                onClick={() => onNavigate('wishlist')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              >
                <Heart className="w-5 h-5 text-gray-700" />
              </button>
            )}

            <button
              onClick={() => user ? onNavigate('cart') : onNavigate('login')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="relative group">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <User className="w-5 h-5 text-gray-700" />
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {user ? (
                  <>
                    {profile?.is_admin && (
                      <button
                        onClick={() => onNavigate('admin')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Admin Panel
                      </button>
                    )}
                    <button
                      onClick={() => onNavigate('orders')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Orders
                    </button>
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onNavigate('login')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => onNavigate('register')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Register
                    </button>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="pb-4">
            <input
              type="text"
              placeholder="Search for jewelry..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
        )}
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => {
                  onNavigate(`category-${category.slug}`);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
