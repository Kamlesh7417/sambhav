import React from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon, 
  ArrowDownTrayIcon, 
  EyeIcon, 
  CalendarIcon, 
  TagIcon, 
  ShoppingBagIcon 
} from '@heroicons/react/24/outline';
import { Document } from '../../store/slices/documentSlice';

interface DocumentCardProps {
  document: Document;
  onView: () => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onView }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'Final':
        return 'bg-green-100 text-green-800';
      case 'Approved':
        return 'bg-blue-100 text-blue-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="glass-card hover:shadow-xl transition-all duration-300"
    >
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <DocumentTextIcon className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{document.name}</h3>
              <p className="text-sm text-gray-500">#{document.id}</p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
            {document.status}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ShoppingBagIcon className="h-4 w-4 text-gray-400" />
            <span>Order: {document.orderId}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <TagIcon className="h-4 w-4 text-gray-400" />
            <span>Type: {document.type}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4 text-gray-400" />
            <span>Created: {new Date(document.date).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="pt-4 border-t flex justify-between items-center">
          <span className="text-sm text-gray-500">{document.size}</span>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onView}
              className="p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-primary-50"
            >
              <EyeIcon className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-primary-50"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentCard;