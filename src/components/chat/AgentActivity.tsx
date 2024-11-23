import React from 'react';
import { motion } from 'framer-motion';
import { AgentActivity as AgentActivityType } from '../../types/agents';
import { FileText, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';

interface AgentActivityProps {
  activities: AgentActivityType[];
  className?: string;
}

const AgentActivity: React.FC<AgentActivityProps> = ({ activities, className = '' }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'document':
        return FileText;
      case 'order':
        return Package;
      case 'shipment':
        return Truck;
      default:
        return Package;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      <div className="p-4 border-b">
        <h3 className="font-medium text-gray-900">Recent Activities</h3>
      </div>
      <div className="p-4 space-y-4">
        {activities.map((activity) => {
          const Icon = getIcon(activity.type);
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-3"
            >
              <div className="p-2 rounded-full bg-gray-100">
                <Icon className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  {getStatusIcon(activity.status)}
                </div>
                <p className="text-sm text-gray-500 mt-1">{activity.details}</p>
                <span className="text-xs text-gray-400 mt-1 block">
                  {new Date(activity.timestamp).toLocaleString()}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentActivity;