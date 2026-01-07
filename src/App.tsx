import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPanel from './pages/AdminPanel';
import { Product } from './lib/supabase';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [productData, setProductData] = useState<Product | null>(null);

  const handleNavigate = (page: string, data?: any) => {
    setCurrentPage(page);
    if (data) {
      setProductData(data);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    if (currentPage === 'home') {
      return <HomePage onNavigate={handleNavigate} />;
    }

    if (currentPage.startsWith('category-')) {
      const slug = currentPage.replace('category-', '');
      return <CategoryPage categorySlug={slug} onNavigate={handleNavigate} />;
    }

    if (currentPage === 'product' && productData) {
      return <ProductDetailPage product={productData} onNavigate={handleNavigate} />;
    }

    if (currentPage === 'cart') {
      if (!user) {
        handleNavigate('login');
        return <LoginPage onNavigate={handleNavigate} />;
      }
      return <CartPage onNavigate={handleNavigate} />;
    }

    if (currentPage === 'wishlist') {
      if (!user) {
        handleNavigate('login');
        return <LoginPage onNavigate={handleNavigate} />;
      }
      return <WishlistPage onNavigate={handleNavigate} />;
    }

    if (currentPage === 'checkout') {
      if (!user) {
        handleNavigate('login');
        return <LoginPage onNavigate={handleNavigate} />;
      }
      return <CheckoutPage onNavigate={handleNavigate} />;
    }

    if (currentPage === 'orders') {
      if (!user) {
        handleNavigate('login');
        return <LoginPage onNavigate={handleNavigate} />;
      }
      return <OrdersPage onNavigate={handleNavigate} />;
    }

    if (currentPage === 'login') {
      return <LoginPage onNavigate={handleNavigate} />;
    }

    if (currentPage === 'register') {
      return <RegisterPage onNavigate={handleNavigate} />;
    }

    if (currentPage === 'admin') {
      return <AdminPanel onNavigate={handleNavigate} />;
    }

    return <HomePage onNavigate={handleNavigate} />;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
