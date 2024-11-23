import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBagIcon, 
  TruckIcon, 
  DocumentCheckIcon, 
  MapPinIcon 
} from '@heroicons/react/24/outline';
import { ShipmentEvent } from '../../store/slices/shipmentSlice';

interface ShipmentTimelineProps {
  events: ShipmentEvent[];
}

const ShipmentTimeline: React.FC<ShipmentTimelineProps> = ({ events }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'pickup':
        return ShoppingBagIcon;
      case 'transit':
        return TruckIcon;
      case 'customs':
        return DocumentCheckIcon;
      case 'delivery':
        return ShoppingBagIcon;
      default:
        return MapPinIcon;
    }
  };

  return (
    <div className="space-y-6">
      {events.map((event, index) => {
        const Icon = getIcon(event.type);
        
        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-4"
          >
            <div className="relative">
              <div className={`p-2 rounded-full ${
                event.type === 'exception' ? 'bg-red-100 text-red-600' :
                event.type === 'customs' ? 'bg-blue-100 text-blue-600' :
                'bg-primary-100 text-primary-600'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              {index !== events.length - 1 && (
                <div className="absolute top-10 bottom-0 left-1/2 w-0.5 -ml-px bg-gray-200" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">{event.status}</div>
              <div className="mt-1 text-sm text-gray-500">{event.description}</div>
              <div className="mt-2 text-xs text-gray-400">
                {new Date(event.timestamp).toLocaleString()}
              </div>
            </div>
            
            <div className="text-right text-sm text-gray-500">
              {event.location}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ShipmentTimeline;