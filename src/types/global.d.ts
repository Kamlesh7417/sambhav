// Type definitions for importing SVGs
declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

// Type definitions for importing PNGs
declare module '*.png' {
  const content: string;
  export default content;
}

// Type definitions for importing JPGs
declare module '*.jpg' {
  const content: string;
  export default content;
}

// Type definitions for importing JSONs
declare module '*.json' {
  const content: { [key: string]: any };
  export default content;
}

// Type definitions for Order interface
export interface Order {
  order_id: string; // Unique identifier for the order
  order_status: string; // Status of the order (e.g., 'Pending', 'Shipped')
  order_placed_timestamp: string; // Timestamp when the order was placed
  customer?: string; // Optional: Customer name or details
  date?: string; // Optional: Specific date for the order
  type?: string; // Optional: Order type (e.g., 'Express', 'Standard')
  priority?: string; // Optional: Priority level of the order
  origin?: string; // Optional: Origin location of the order
  destination?: string; // Optional: Destination location of the order
  items?: Array<{
    name: string; // Name of the item
    quantity: number; // Quantity of the item
    price: number; // Price of the item
  }>; // Optional: Array of items in the order
  total?: number; // Optional: Total amount for the order
  customsInfo?: {
    exportLicense: string; // Export license details
    hsCode: string; // Harmonized system code for customs
    declaredValue: number; // Declared value for customs
  }; // Optional: Customs information
}

// Extend React's Default Props (optional, if required by your project)
declare namespace React {
  interface Attributes {
    styleName?: string;
  }
}
