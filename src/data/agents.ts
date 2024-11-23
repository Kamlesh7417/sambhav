import { Agent } from '../types/agents';

export const agents: Agent[] = [
  {
    id: 'order-agent',
    name: 'Maya',
    role: 'Order Management Specialist',
    avatar: 'https://ui-avatars.com/api/?name=Maya&background=6366f1&color=fff',
    specialty: 'Order Processing & Tracking',
    status: 'online',
    description: 'Expert in handling order processing, modifications, and status updates.'
  },
  {
    id: 'doc-agent',
    name: 'Raj',
    role: 'Documentation Compliance Expert',
    avatar: 'https://ui-avatars.com/api/?name=Raj&background=f59e0b&color=fff',
    specialty: 'Export Documentation & Compliance',
    status: 'online',
    description: 'Specialized in export documentation and regulatory compliance.'
  },
  {
    id: 'shipping-agent',
    name: 'Sarah',
    role: 'Logistics Coordinator',
    avatar: 'https://ui-avatars.com/api/?name=Sarah&background=10b981&color=fff',
    specialty: 'Shipment Planning & Tracking',
    status: 'online',
    description: 'Expert in optimizing shipping routes and tracking shipments.'
  },
  {
    id: 'customs-agent',
    name: 'Alex',
    role: 'Customs Clearance Specialist',
    avatar: 'https://ui-avatars.com/api/?name=Alex&background=ef4444&color=fff',
    specialty: 'Customs Regulations & Clearance',
    status: 'online',
    description: 'Specialized in customs regulations and clearance procedures.'
  }
];