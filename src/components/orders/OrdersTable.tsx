import React from 'react';
import { motion } from 'framer-motion';
import { Order } from '../../services/api';
import OrdersTableRow from './OrdersTableRow';
import OrdersTableHeader from './OrdersTableHeader';
import OrdersTableEmpty from './OrdersTableEmpty';
import OrdersTableLoading from './OrdersTableLoading';

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  onOrderClick: (orderId: string) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, loading, onOrderClick }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <OrdersTableHeader />
        <tbody className="bg-white/50 divide-y divide-gray-200">
          {loading ? (
            <OrdersTableLoading />
          ) : orders.length === 0 ? (
            <OrdersTableEmpty />
          ) : (
            orders.map((order) => (
              <OrdersTableRow 
                key={order.order_id}
                order={order}
                onClick={() => onOrderClick(order.order_id)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;