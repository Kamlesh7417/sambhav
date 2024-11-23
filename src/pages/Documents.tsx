import React, { useState, useEffect } from 'react';
import { 
  ArrowUpTrayIcon, 
  MagnifyingGlassIcon,
  DocumentTextIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useDocuments } from '../hooks/useDocuments';
import DocumentCard from '../components/documents/DocumentCard';
import Pagination from '../components/common/Pagination';
import DocumentViewer from '../components/documents/DocumentViewer';

const Documents = () => {
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const { documents, loading, pagination, filters, setPage, setFilters } = useDocuments(selectedOrderId);
  const [filteredDocuments, setFilteredDocuments] = useState<any[]>([]);

  const documentStatuses = ['All Statuses', 'Draft', 'Final', 'Approved', 'Rejected'];

  // Group documents by order ID
  const groupedDocuments = Object.values(documents).reduce((acc, doc) => {
    if (!acc[doc.orderId]) {
      acc[doc.orderId] = [];
    }
    acc[doc.orderId].push(doc);
    return acc;
  }, {} as Record<string, typeof documents[keyof typeof documents][]>);

  // Apply filters whenever documents or filters change
  useEffect(() => {
    let filtered = Object.values(documents);

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm) ||
        doc.orderId.toLowerCase().includes(searchTerm)
      );
    }

    // Apply status filter
    if (filters.status && filters.status !== 'All Statuses') {
      filtered = filtered.filter(doc => doc.status === filters.status);
    }

    // Apply order filter
    if (selectedOrderId) {
      filtered = filtered.filter(doc => doc.orderId === selectedOrderId);
    }

    setFilteredDocuments(filtered);
    setPage(1); // Reset to first page when filters change
  }, [documents, filters, selectedOrderId, setPage]);

  const handleViewDocument = (document: any) => {
    setSelectedDocument(document);
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters({ ...filters, ...newFilters });
  };

  const paginatedDocuments = filteredDocuments.slice(
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
          Documents
        </motion.h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <select
          value={selectedOrderId}
          onChange={(e) => setSelectedOrderId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">All Orders</option>
          {Object.keys(groupedDocuments).map((orderId) => (
            <option key={orderId} value={orderId}>{orderId}</option>
          ))}
        </select>

        <select
          value={filters.status || 'All Statuses'}
          onChange={(e) => handleFilterChange({ status: e.target.value === 'All Statuses' ? null : e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {documentStatuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {paginatedDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedDocuments.map((doc) => (
                <DocumentCard 
                  key={doc.id} 
                  document={doc} 
                  onView={() => handleViewDocument(doc)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No documents found matching your filters
            </div>
          )}
        </div>
      )}

      {filteredDocuments.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={Math.ceil(filteredDocuments.length / pagination.itemsPerPage)}
          onPageChange={setPage}
        />
      )}

      {selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
};

export default Documents;