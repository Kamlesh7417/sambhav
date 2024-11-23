import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import NewShipmentModal from '../components/shipping/NewShipmentModal';
import { useShipments } from '../hooks/useShipments';
import Pagination from '../components/common/Pagination';
import DateRangeFilter from '../components/common/DateRangeFilter';
import ShipmentDetails from '../components/shipping/ShipmentDetails';
import ShipmentCard from '../components/shipping/ShipmentCard';
import ShippingFilters from '../components/shipping/ShippingFilters';

const Shipments: React.FC = () => {
  const [showNewShipmentModal, setShowNewShipmentModal] = useState(false);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const { shipments, loading, pagination, filters, setPage, setFilters } = useShipments();
  const [filteredShipments, setFilteredShipments] = useState<any[]>([]);

  // Apply filters whenever shipments or filters change
  useEffect(() => {
    let filtered = Object.values(shipments);

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(shipment => 
        shipment.orderId.toLowerCase().includes(searchTerm)
      );
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(shipment => 
        shipment.status.toLowerCase() === filters.status?.toLowerCase()
      );
    }

    // Apply date range filter
    if (filters.dateRange || (filters.customDateRange.start && filters.customDateRange.end)) {
      const startDate = filters.customDateRange.start ? new Date(filters.customDateRange.start) : null;
      const endDate = filters.customDateRange.end ? new Date(filters.customDateRange.end) : null;

      filtered = filtered.filter(shipment => {
        const shipmentDate = new Date(shipment.eta);
        
        if (filters.dateRange === 'today') {
          const today = new Date();
          return shipmentDate.toDateString() === today.toDateString();
        } else if (filters.dateRange === 'week') {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return shipmentDate >= weekAgo;
        } else if (filters.dateRange === 'month') {
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return shipmentDate >= monthAgo;
        } else if (startDate && endDate) {
          return shipmentDate >= startDate && shipmentDate <= endDate;
        }
        
        return true;
      });
    }

    setFilteredShipments(filtered);
  }, [shipments, filters]);

  const handleShipmentClick = (shipmentId: string) => {
    setSelectedShipmentId(shipmentId);
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters({ ...filters, ...newFilters });
  };

  const paginatedShipments = filteredShipments.slice(
    (pagination.currentPage - 1) * pagination.itemsPerPage,
    pagination.currentPage * pagination.itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.h1 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent"
        >
          Shipments
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNewShipmentModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Shipment</span>
        </motion.button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <ShippingFilters
          orderId={filters?.search || ''}
          onOrderIdChange={(value) => handleFilterChange({ search: value })}
        />
        
        <DateRangeFilter
          dateRange={filters?.dateRange || null}
          customDateRange={filters?.customDateRange || { start: null, end: null }}
          onDateRangeChange={(range) => handleFilterChange({ dateRange: range })}
          onCustomDateChange={(dates) => handleFilterChange({ customDateRange: dates })}
        />

        <select
          value={filters?.status || ''}
          onChange={(e) => handleFilterChange({ status: e.target.value || null })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">All Statuses</option>
          <option value="Processing">Processing</option>
          <option value="In Transit">In Transit</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedShipments.length > 0 ? (
            paginatedShipments.map((shipment) => (
              <ShipmentCard
                key={shipment.id}
                shipment={shipment}
                onClick={() => handleShipmentClick(shipment.id)}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-gray-500">
              No shipments found matching your filters
            </div>
          )}
        </div>
      )}

      {filteredShipments.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={Math.ceil(filteredShipments.length / pagination.itemsPerPage)}
          onPageChange={setPage}
        />
      )}

      {showNewShipmentModal && (
        <NewShipmentModal 
          onClose={() => setShowNewShipmentModal(false)}
          orderId={filters?.search || ''}
        />
      )}

      {selectedShipmentId && (
        <ShipmentDetails
          shipment={shipments[selectedShipmentId]}
          onClose={() => setSelectedShipmentId(null)}
        />
      )}
    </div>
  );
};

export default Shipments;