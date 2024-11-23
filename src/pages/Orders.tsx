import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOrders } from '../hooks/useOrders';
import Pagination from '../components/common/Pagination';
import OrderDetails from '../components/orders/OrderDetails';
import OrdersHeader from '../components/orders/OrdersHeader';
import OrdersFilters from '../components/orders/OrdersFilters';
import OrdersTable from '../components/orders/OrdersTable';
import ErrorAlert from '../components/common/ErrorAlert';

const Orders = () => {
  const { 
    orders, 
    loading, 
    error, 
    refreshOrders, 
    isRetrying, 
    retryAttempt 
  } = useOrders();
  
  const [showDetails, setShowDetails] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10
  });

  // Apply filters whenever orders or filters change
  useEffect(() => {
    const filtered = Object.values(orders).filter(order => {
      const matchesSearch = order.order_id.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = !filters.status || order.order_status.toLowerCase() === filters.status.toLowerCase();
      return matchesSearch && matchesStatus;
    });

    setFilteredOrders(filtered);
    setPagination(prev => ({
      ...prev,
      totalPages: Math.ceil(filtered.length / prev.itemsPerPage),
      currentPage: 1 // Reset to first page when filters change
    }));
  }, [orders, filters]);

  const handleRowClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowDetails(true);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const paginatedOrders = filteredOrders.slice(
    (pagination.currentPage - 1) * pagination.itemsPerPage,
    pagination.currentPage * pagination.itemsPerPage
  );

  return (
    <div className="space-y-6">
      <OrdersHeader onRefresh={refreshOrders} />
      
      {!error && (
        <OrdersFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      )}

      <div className="glass-card">
        {error ? (
          <ErrorAlert 
            message={error}
            onRetry={refreshOrders}
            isRetrying={isRetrying}
            retryAttempt={retryAttempt}
          />
        ) : (
          <>
            <OrdersTable
              orders={paginatedOrders}
              loading={loading}
              onOrderClick={handleRowClick}
            />

            {!loading && filteredOrders.length > 0 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
              />
            )}
          </>
        )}
      </div>

      {showDetails && (
        <OrderDetails
          orderId={selectedOrderId}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
};

export default Orders;