import React from 'react';
import { motion } from 'framer-motion';
import { Order } from '../../services/api';
import OrderStatusBadge from './OrderStatusBadge';

interface OrdersTableRowProps {
  order: Order;
  onClick: () => void;
}

const OrdersTableRow: React.FC<OrdersTableRowProps> = ({ order, onClick }) => {
  return (
    <motion.tr
      whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {order.order_id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(order.order_placed_timestamp).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <OrderStatusBadge status={order.order_status} />
      </td>
    </motion.tr>
  );
};

export default OrdersTableRow;