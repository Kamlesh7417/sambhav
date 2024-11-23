import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBagIcon,
  MapPinIcon,
  CalendarIcon,
  TagIcon,
  DocumentTextIcon,
  TruckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';

interface Order {
  order_id: string;
  order_status: string;
  order_placed_timestamp: string;
  customer?: string;
  type?: string;
  priority?: string;
  origin?: string;
  destination?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total?: number;
  customsInfo?: {
    exportLicense: string;
    hsCode: string;
    declaredValue: number;
  };
}

interface OrderDetailsProps {
  orderId: string;
  onClose: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId, onClose }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://susowh1c2f.execute-api.us-east-1.amazonaws.com/v1/orders/${orderId}`);
        setOrder(response.data);
      } catch (err) {
        setError('Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <p className="text-red-500">{error}</p>
        <button onClick={onClose} className="ml-4 px-4 py-2 bg-gray-800 text-white rounded-lg">
          Close
        </button>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const orderDate = order.order_placed_timestamp
    ? new Date(order.order_placed_timestamp).toLocaleDateString()
    : 'Unknown Date';

  const totalAmount = order.total ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b bg-gradient-to-r from-primary-50 to-primary-100 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order #{order.order_id}</h2>
            <p className="text-sm text-gray-600 mt-1">Created on {orderDate}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/50 rounded-full transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
            <div className="glass-card p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <ShoppingBagIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Customer:</span>
                <span className="font-medium">{order.customer || 'Unknown'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TagIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{order.type || 'Not Specified'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Priority:</span>
                <span
                  className={`font-medium ${
                    order.priority === 'Urgent'
                      ? 'text-red-600'
                      : order.priority === 'Express'
                      ? 'text-orange-600'
                      : 'text-green-600'
                  }`}
                >
                  {order.priority || 'Normal'}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Shipping Information</h3>
            <div className="glass-card p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Origin:</span>
                <span className="font-medium">{order.origin || 'Unknown'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Destination:</span>
                <span className="font-medium">{order.destination || 'Unknown'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TruckIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  order.order_status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                  order.order_status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                  order.order_status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.order_status}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
            <div className="glass-card overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-gray-200">
                  {order.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{item.price.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50/50">
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">Total Amount:</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600 font-bold">
                      ₹{totalAmount.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderDetails;
