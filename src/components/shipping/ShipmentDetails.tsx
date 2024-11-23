import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPinIcon, 
  ChatBubbleLeftRightIcon, 
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Shipment } from '../../store/slices/shipmentSlice';
import ShipmentTimeline from './ShipmentTimeline';
import ShipmentMap from './ShipmentMap';
import ShipmentCommunications from './ShipmentCommunications';

interface ShipmentDetailsProps {
  shipment: Shipment;
  onClose: () => void;
}

const ShipmentDetails: React.FC<ShipmentDetailsProps> = ({ shipment, onClose }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'map' | 'communications'>('timeline');

  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: ClockIcon },
    { id: 'map', label: 'Map View', icon: MapPinIcon },
    { id: 'communications', label: 'Communications', icon: ChatBubbleLeftRightIcon },
  ];

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
        className="glass-card w-full max-w-6xl max-h-[90vh] overflow-hidden m-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-primary-50 to-primary-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Shipment #{shipment.id}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {shipment.origin} → {shipment.destination}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'timeline' && <ShipmentTimeline events={shipment.tracking} />}
            {activeTab === 'map' && <ShipmentMap shipment={shipment} />}
            {activeTab === 'communications' && <ShipmentCommunications communications={shipment.communications} />}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShipmentDetails;