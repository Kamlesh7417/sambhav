import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon,
  PaperClipIcon,
  UserIcon,
  BuildingOfficeIcon,
  TruckIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { Communication } from '../../store/slices/shipmentSlice';

interface ShipmentCommunicationsProps {
  communications: Communication[];
}

const ShipmentCommunications: React.FC<ShipmentCommunicationsProps> = ({ communications }) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'buyer':
        return UserIcon;
      case 'seller':
        return BuildingOfficeIcon;
      case 'carrier':
        return TruckIcon;
      case 'agent':
        return PhoneIcon;
      default:
        return ChatBubbleLeftRightIcon;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'buyer':
        return 'bg-blue-100 text-blue-600';
      case 'seller':
        return 'bg-purple-100 text-purple-600';
      case 'carrier':
        return 'bg-green-100 text-green-600';
      case 'agent':
        return 'bg-primary-100 text-primary-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {communications.map((comm, index) => {
        const Icon = getRoleIcon(comm.role);
        
        return (
          <motion.div
            key={comm.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex space-x-4"
          >
            <div className={`p-2 rounded-full h-fit ${getRoleColor(comm.role)}`}>
              <Icon className="h-5 w-5" />
            </div>
            
            <div className="flex-1 glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-medium text-gray-900">{comm.sender}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({comm.role.charAt(0).toUpperCase() + comm.role.slice(1)})
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(comm.timestamp).toLocaleString()}
                </span>
              </div>
              
              <p className="text-gray-700">{comm.message}</p>
              
              {comm.attachments && comm.attachments.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {comm.attachments.map((attachment, i) => (
                    <a
                      key={i}
                      href={attachment.url}
                      className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700 bg-white/50 px-3 py-1 rounded-full border border-primary-200 hover:bg-white/80 transition-colors duration-200"
                    >
                      <PaperClipIcon className="h-4 w-4" />
                      <span>{attachment.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ShipmentCommunications;