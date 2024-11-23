import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface OrdersFiltersProps {
  filters: {
    search: string;
    status: string;
  };
  onFilterChange: (filters: { search: string; status: string }) => void;
}

const OrdersFilters: React.FC<OrdersFiltersProps> = ({ filters, onFilterChange }) => {
  const statuses = ['Open', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, status: e.target.value });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search orders..."
          value={filters.search}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <select
        value={filters.status}
        onChange={handleStatusChange}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        <option value="">All Statuses</option>
        {statuses.map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
    </div>
  );
};

export default OrdersFilters;