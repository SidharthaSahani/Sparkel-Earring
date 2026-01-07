export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-pink-50 to-rose-50 border-t border-pink-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-4">
              ✨ Sparkle & Shine
            </h3>
            <p className="text-gray-600 text-sm">
              Discover beautiful jewelry pieces that make you shine. Quality craftsmanship meets elegant design.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-pink-500 transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-pink-500 transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-pink-500 transition-colors">Sale</a></li>
              <li><a href="#" className="hover:text-pink-500 transition-colors">All Products</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Customer Care</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-pink-500 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-pink-500 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-pink-500 transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-pink-500 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-4">About</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-pink-500 transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-pink-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-pink-500 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-pink-100 text-center text-sm text-gray-600">
          <p>&copy; 2024 Sparkle & Shine. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
