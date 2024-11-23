import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';

interface ShipmentMapProps {
  shipment: any;
}

const ShipmentMap: React.FC<ShipmentMapProps> = ({ shipment }) => {
  return (
    <div className="bg-white rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Shipment Route</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <MapPin className="h-4 w-4" />
          <span>Live Tracking</span>
        </div>
      </div>

      <div className="relative h-[400px] bg-gray-100 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Navigation className="h-12 w-12 text-primary-500 mb-2" />
            <p className="text-gray-600">Shipment en route</p>
            <p className="text-sm text-gray-500">
              From {shipment.origin} to {shipment.destination}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Origin</p>
          <p className="font-medium text-gray-900">{shipment.origin}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Destination</p>
          <p className="font-medium text-gray-900">{shipment.destination}</p>
        </div>
      </div>
    </div>
  );
};

export default ShipmentMap;