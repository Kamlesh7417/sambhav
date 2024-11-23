import React from 'react';
import { motion } from 'framer-motion';
import { 
  XMarkIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  CalendarIcon,
  TagIcon,
  ShoppingBagIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { Document } from '../../store/slices/documentSlice';

interface DocumentViewerProps {
  document: Document;
  onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, onClose }) => {
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
        className="glass-card w-full max-w-4xl max-h-[90vh] overflow-hidden m-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-primary-50 to-primary-100 flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <DocumentTextIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{document.name}</h2>
              <p className="text-sm text-gray-600">Document #{document.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Document Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="glass-card p-4 space-y-4">
              <div className="flex items-center space-x-3">
                <ShoppingBagIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-medium text-gray-900">{document.orderId}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <TagIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Document Type</p>
                  <p className="font-medium text-gray-900">{document.type}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Created Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(document.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium text-gray-900">{document.status}</p>
                </div>
              </div>
            </div>

            {/* Document Preview */}
            <div className="glass-card p-4 h-96 flex items-center justify-center">
              <div className="text-center">
                <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Document Preview</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              <span>Download</span>
            </motion.button>

            <div className="glass-card p-4">
              <h3 className="font-medium text-gray-900 mb-2">Document Details</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Size: {document.size}</p>
                <p>Format: PDF</p>
                <p>Last Modified: {new Date(document.date).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DocumentViewer;