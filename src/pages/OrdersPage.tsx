import { useEffect, useState } from 'react';
import { supabase, Order, OrderItem, Product } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Package } from 'lucide-react';

type OrdersPageProps = {
  onNavigate: (page: string) => void;
};

type OrderWithItems = Order & {
  orderItems: (OrderItem & { product: Product })[];
};

export default function OrdersPage({ onNavigate }: OrdersPageProps) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    setLoading(true);
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (orderError) {
      console.error('Error fetching orders:', orderError);
      setLoading(false);
      return;
    }

    const ordersWithItems: OrderWithItems[] = [];

    for (const order of orderData || []) {
      const { data: itemsData } = await supabase
        .from('order_items')
        .select('*, product:products(*)')
        .eq('order_id', order.id);

      ordersWithItems.push({
        ...order,
        orderItems: itemsData || [],
      });
    }

    setOrders(ordersWithItems);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-8">Start shopping to place your first order!</p>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-mono text-sm font-semibold text-gray-800">
                      {order.id.slice(0, 8)}...
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="font-semibold text-gray-800">
                      ${order.total_amount.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Items</h3>
                <div className="space-y-3">
                  {order.orderItems.map(item => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.product?.name || 'Product'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        {item.selected_color && (
                          <p className="text-sm text-gray-600">
                            Color: {item.selected_color}
                          </p>
                        )}
                        {item.selected_size && (
                          <p className="text-sm text-gray-600">
                            Size: {item.selected_size}
                          </p>
                        )}
                      </div>
                      <p className="font-semibold text-gray-800">
                        ${(item.price_at_time * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {order.shipping_address && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3">Shipping Address</h3>
                  <div className="text-sm text-gray-600">
                    <p>{order.shipping_address.full_name}</p>
                    <p>{order.shipping_address.address_line1}</p>
                    {order.shipping_address.address_line2 && (
                      <p>{order.shipping_address.address_line2}</p>
                    )}
                    <p>
                      {order.shipping_address.city}, {order.shipping_address.state}{' '}
                      {order.shipping_address.postal_code}
                    </p>
                    <p>{order.shipping_address.phone}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
