import React from 'react';

const OrdersTableHeader = () => {
  return (
    <thead className="bg-gray-50/50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
          Order ID
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
          Date
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
          Status
        </th>
      </tr>
    </thead>
  );
};

export default OrdersTableHeader;