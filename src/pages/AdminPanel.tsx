import { useState, useEffect } from 'react';
import { supabase, Category, Product, CarouselBanner } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

type AdminPanelProps = {
  onNavigate: (page: string) => void;
};

export default function AdminPanel({ onNavigate }: AdminPanelProps) {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<CarouselBanner[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingBanner, setEditingBanner] = useState<CarouselBanner | null>(null);

  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    category_id: '',
    images: [],
    colors: [],
    sizes: [],
    stock: 0,
    discount_percentage: 0,
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: false,
  });

  const [bannerForm, setBannerForm] = useState({
    image_url: '',
    title: '',
    subtitle: '',
    link_url: '',
    is_active: true,
  });

  useEffect(() => {
    if (!profile?.is_admin) {
      onNavigate('home');
      return;
    }
    fetchAllData();
  }, [profile]);

  const fetchAllData = async () => {
    const [categoriesData, productsData, bannersData] = await Promise.all([
      supabase.from('categories').select('*').order('display_order'),
      supabase.from('products').select('*'),
      supabase.from('carousel_banners').select('*').order('display_order'),
    ]);

    if (categoriesData.data) setCategories(categoriesData.data);
    if (productsData.data) setProducts(productsData.data);
    if (bannersData.data) setBanners(bannersData.data);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update(productForm)
        .eq('id', editingProduct.id);

      if (error) {
        alert('Error updating product: ' + error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert([productForm]);

      if (error) {
        alert('Error creating product: ' + error.message);
        return;
      }
    }

    setShowProductForm(false);
    setEditingProduct(null);
    setProductForm({
      name: '',
      slug: '',
      description: '',
      price: 0,
      category_id: '',
      images: [],
      colors: [],
      sizes: [],
      stock: 0,
      discount_percentage: 0,
      is_featured: false,
      is_new_arrival: false,
      is_best_seller: false,
    });
    await fetchAllData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error deleting product: ' + error.message);
    } else {
      await fetchAllData();
    }
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingBanner) {
      const { error } = await supabase
        .from('carousel_banners')
        .update(bannerForm)
        .eq('id', editingBanner.id);

      if (error) {
        alert('Error updating banner: ' + error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from('carousel_banners')
        .insert([bannerForm]);

      if (error) {
        alert('Error creating banner: ' + error.message);
        return;
      }
    }

    setShowBannerForm(false);
    setEditingBanner(null);
    setBannerForm({
      image_url: '',
      title: '',
      subtitle: '',
      link_url: '',
      is_active: true,
    });
    await fetchAllData();
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm('Are you sure?')) return;

    const { error } = await supabase
      .from('carousel_banners')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error deleting banner: ' + error.message);
    } else {
      await fetchAllData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Admin Panel</h1>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'products'
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-800 border-2 border-gray-300 hover:border-pink-400'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'banners'
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-800 border-2 border-gray-300 hover:border-pink-400'
            }`}
          >
            Carousel Banners
          </button>
        </div>

        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Products</h2>
              <button
                onClick={() => {
                  setShowProductForm(true);
                  setEditingProduct(null);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-pink-400 to-rose-400 text-white px-4 py-2 rounded-lg hover:from-pink-500 hover:to-rose-500 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>

            {showProductForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowProductForm(false);
                      setEditingProduct(null);
                    }}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />

                  <input
                    type="text"
                    placeholder="Slug"
                    value={productForm.slug}
                    onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />

                  <textarea
                    placeholder="Description"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Price"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />

                    <select
                      value={productForm.category_id}
                      onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Stock"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />

                    <input
                      type="number"
                      placeholder="Discount %"
                      value={productForm.discount_percentage}
                      onChange={(e) => setProductForm({ ...productForm, discount_percentage: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                  </div>

                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.is_featured}
                        onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-700">Featured</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.is_new_arrival}
                        onChange={(e) => setProductForm({ ...productForm, is_new_arrival: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-700">New Arrival</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.is_best_seller}
                        onChange={(e) => setProductForm({ ...productForm, is_best_seller: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-700">Best Seller</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white py-2 rounded-lg font-semibold hover:from-pink-500 hover:to-rose-500 transition-all"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </form>
              </div>
            )}

            <div className="grid gap-4">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-600">${product.price.toFixed(2)} - Stock: {product.stock}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setProductForm({
                          name: product.name,
                          slug: product.slug,
                          description: product.description,
                          price: product.price,
                          category_id: product.category_id,
                          images: product.images,
                          colors: product.colors,
                          sizes: product.sizes,
                          stock: product.stock,
                          discount_percentage: product.discount_percentage,
                          is_featured: product.is_featured,
                          is_new_arrival: product.is_new_arrival,
                          is_best_seller: product.is_best_seller,
                        });
                        setShowProductForm(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'banners' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Carousel Banners</h2>
              <button
                onClick={() => {
                  setShowBannerForm(true);
                  setEditingBanner(null);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-pink-400 to-rose-400 text-white px-4 py-2 rounded-lg hover:from-pink-500 hover:to-rose-500 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Banner
              </button>
            </div>

            {showBannerForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowBannerForm(false);
                      setEditingBanner(null);
                    }}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleBannerSubmit} className="space-y-4">
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={bannerForm.image_url}
                    onChange={(e) => setBannerForm({ ...bannerForm, image_url: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />

                  <input
                    type="text"
                    placeholder="Title"
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />

                  <input
                    type="text"
                    placeholder="Subtitle"
                    value={bannerForm.subtitle}
                    onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />

                  <input
                    type="url"
                    placeholder="Link URL"
                    value={bannerForm.link_url}
                    onChange={(e) => setBannerForm({ ...bannerForm, link_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bannerForm.is_active}
                      onChange={(e) => setBannerForm({ ...bannerForm, is_active: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700">Active</span>
                  </label>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white py-2 rounded-lg font-semibold hover:from-pink-500 hover:to-rose-500 transition-all"
                  >
                    {editingBanner ? 'Update Banner' : 'Add Banner'}
                  </button>
                </form>
              </div>
            )}

            <div className="grid gap-4">
              {banners.map(banner => (
                <div key={banner.id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
                  <div className="flex gap-4 flex-1">
                    <img
                      src={banner.image_url}
                      alt={banner.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{banner.title}</h3>
                      <p className="text-sm text-gray-600">{banner.subtitle}</p>
                      <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-semibold ${banner.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {banner.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingBanner(banner);
                        setBannerForm({
                          image_url: banner.image_url,
                          title: banner.title,
                          subtitle: banner.subtitle,
                          link_url: banner.link_url,
                          is_active: banner.is_active,
                        });
                        setShowBannerForm(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
