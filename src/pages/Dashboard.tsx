import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBagIcon, 
  TruckIcon, 
  CurrencyDollarIcon, 
  BellIcon, 
  ExclamationTriangleIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';
import Notifications from '../components/Notifications';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useOrders } from '../hooks/useOrders';
import { useShipments } from '../hooks/useShipments';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { orders } = useOrders();
  const { shipments } = useShipments();

  const stats = [
    { icon: ShoppingBagIcon, label: 'Total Orders', value: Object.keys(orders).length, change: '+12%' },
    { icon: TruckIcon, label: 'Active Shipments', value: Object.values(shipments).filter(s => s.status === 'In Transit').length, change: '+8%' },
    { icon: CurrencyDollarIcon, label: 'Revenue', value: '₹12.4L', change: '+15%' },
    { icon: ExclamationTriangleIcon, label: 'Pending Actions', value: '23', change: '-5%' },
  ];

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Orders',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Orders Trend',
      },
    },
  };

  const recentUpdates = [
    {
      id: 1,
      type: 'shipment',
      icon: TruckIcon,
      title: 'Shipment SHP001 Delayed',
      description: 'Customs clearance taking longer than expected at Dubai Port',
      timestamp: '2 hours ago',
      priority: 'high',
    },
    {
      id: 2,
      type: 'order',
      icon: ShoppingBagIcon,
      title: 'New Order Received',
      description: 'ORD025 from Tech Solutions Global worth ₹8.5L',
      timestamp: '4 hours ago',
      priority: 'medium',
    },
    {
      id: 3,
      type: 'document',
      icon: DocumentTextIcon,
      title: 'Document Expiring Soon',
      description: 'Export License for ORD018 expires in 5 days',
      timestamp: '6 hours ago',
      priority: 'high',
    },
    {
      id: 4,
      type: 'shipment',
      icon: TruckIcon,
      title: 'Route Optimization Alert',
      description: 'Alternative route available for SHP015 saving 2 days',
      timestamp: '8 hours ago',
      priority: 'medium',
    },
  ];

  const pendingTasks = [
    {
      id: 1,
      title: 'Document Verification Required',
      description: 'Review and approve customs documentation for ORD023',
      deadline: 'Today, 5:00 PM',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Shipment Insurance Renewal',
      description: 'Renew cargo insurance for 5 active shipments',
      deadline: 'Tomorrow, 12:00 PM',
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Rate Negotiation',
      description: 'Negotiate shipping rates with DHL for bulk orders',
      deadline: 'Sep 25, 2024',
      priority: 'medium',
    },
    {
      id: 4,
      title: 'Compliance Review',
      description: 'Review updated export regulations for UAE shipments',
      deadline: 'Sep 26, 2024',
      priority: 'high',
    },
  ];

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Rest of the JSX remains the same */}
      <div className="flex items-center justify-between">
        <motion.h1 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent"
        >
          Dashboard
        </motion.h1>
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
          >
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </motion.button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 z-50">
              <Notifications />
            </div>
          )}
        </div>
      </div>

      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.02 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-primary-900">{stat.value}</p>
              </div>
              <div className="flex flex-col items-end">
                <stat.icon className="h-8 w-8 text-primary-600" />
                <span className={`text-sm ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0 },
        }}
        className="glass-card p-6"
      >
        <Line options={chartOptions} data={chartData} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Updates */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
          }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold text-primary-900 mb-4">Recent Updates</h2>
          <div className="space-y-4">
            {recentUpdates.map((update) => (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-start space-x-3 p-3 rounded-lg ${
                  update.priority === 'high' ? 'bg-red-50' : 'bg-blue-50'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  update.priority === 'high' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  <update.icon className={`h-5 w-5 ${
                    update.priority === 'high' ? 'text-red-600' : 'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{update.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{update.description}</p>
                  <span className="text-xs text-gray-500 mt-1">{update.timestamp}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pending Tasks */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
          }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold text-primary-900 mb-4">Pending Tasks</h2>
          <div className="space-y-4">
            {pendingTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className={`p-2 rounded-full ${
                  task.priority === 'high' ? 'bg-red-100' : 'bg-yellow-100'
                }`}>
                  <ClockIcon className={`h-5 w-5 ${
                    task.priority === 'high' ? 'text-red-600' : 'text-yellow-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{task.deadline}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      task.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;