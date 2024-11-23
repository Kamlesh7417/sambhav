import React, { useState } from 'react';
import { 
  PaperAirplaneIcon, 
  PhoneIcon, 
  VideoCameraIcon 
} from '@heroicons/react/24/outline';

const Chat = () => {
  const [message, setMessage] = useState('');

  const messages = [
    {
      id: 1,
      sender: 'Agent',
      content: 'Hello! How can I help you today?',
      time: '10:00 AM',
    },
    {
      id: 2,
      sender: 'You',
      content: 'I need help tracking my shipment SHP001',
      time: '10:02 AM',
    },
    {
      id: 3,
      sender: 'Agent',
      content: 'I can help you with that. Let me check the status for you.',
      time: '10:03 AM',
    },
  ];

  const handleSend = () => {
    if (message.trim()) {
      // Add message handling logic here
      setMessage('');
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col space-y-4">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Support Chat</h1>
          <p className="text-sm text-gray-500">Agent: Sarah Johnson</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200">
            <PhoneIcon className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200">
            <VideoCameraIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-sm overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.sender === 'You'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs mt-1 opacity-75">{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;