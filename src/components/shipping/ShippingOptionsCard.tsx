import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ClockIcon,
  ShoppingBagIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import NegotiationChat, { NegotiationMessage } from './NegotiationChat';

interface ShippingOption {
  carrier: string;
  logo: string;
  service: string;
  days: string;
  originalPrice: number;
  discountedPrice: number;
  aiSavings: number;
  reliability: number;
  count: number;
  type: string;
  co2: number;
  customs: string;
  documentation: string[];
}

interface ShippingOptionsCardProps {
  data: ShippingOption[];
  onSelect: (option: ShippingOption) => void;
}

const mockNegotiationMessages: NegotiationMessage[] = [
  {
    id: '1',
    sender: 'ai',
    message: 'Initiating negotiation with carrier...',
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    sender: 'carrier',
    message: 'Current rate is ₹95,000',
    timestamp: new Date().toISOString(),
    priceQuote: 95000
  },
  {
    id: '3',
    sender: 'ai',
    message: 'Based on current market rates and volume, requesting better pricing.',
    timestamp: new Date().toISOString()
  },
  {
    id: '4',
    sender: 'carrier',
    message: 'We can offer a 5% discount.',
    timestamp: new Date().toISOString(),
    priceQuote: 90250
  },
  {
    id: '5',
    sender: 'ai',
    message: 'Negotiating further based on your premium customer status and shipment history.',
    timestamp: new Date().toISOString()
  },
  {
    id: '6',
    sender: 'carrier',
    message: 'Final offer: ₹90,000 including premium service benefits.',
    timestamp: new Date().toISOString(),
    priceQuote: 90000
  }
];

const ShippingOptionsCard: React.FC<ShippingOptionsCardProps> = ({ data, onSelect }) => {
  const [showNegotiation, setShowNegotiation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<ShippingOption | null>(null);

  const handleNegotiation = (option: ShippingOption) => {
    setSelectedOption(option);
    setShowNegotiation(true);
  };

  const handleSelect = (option: ShippingOption) => {
    onSelect(option);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((option, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            {/* Card content remains the same */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <img src={option.logo} alt={option.carrier} className="h-8 object-contain" />
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  option.type === 'Best Option' ? 'bg-purple-100 text-purple-800' :
                  option.type === 'Cost-Effective' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {option.type}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">{option.service}</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>{option.days} days</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ShieldCheckIcon className="h-4 w-4 mr-2" />
                    <span>{option.reliability}% reliability</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ShoppingBagIcon className="h-4 w-4 mr-2" />
                    <span>{option.count} containers available</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-gray-500 line-through">₹{option.originalPrice.toLocaleString()}</p>
                    <p className="text-2xl font-bold text-gray-900">₹{option.discountedPrice.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600 font-medium">
                      Save ₹{option.aiSavings.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNegotiation(option)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors duration-200"
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                  <span>Negotiate</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(option)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800"
                >
                  <SparklesIcon className="h-4 w-4" />
                  <span>Select</span>
                </motion.button>
              </div>
            </div>

            <div className="px-6 py-4 bg-green-50">
              <div className="flex items-center text-green-700">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-2" />
                <span className="text-sm">Saves {option.co2}kg CO₂</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showNegotiation && selectedOption && (
        <NegotiationChat
          messages={mockNegotiationMessages}
          originalPrice={selectedOption.originalPrice}
          finalPrice={selectedOption.discountedPrice}
          onClose={() => setShowNegotiation(false)}
        />
      )}
    </>
  );
};

export default ShippingOptionsCard;