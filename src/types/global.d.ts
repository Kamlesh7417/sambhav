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
  id: string; // ID property added
  customerName: string;
  date: string;
  status: string;
  totalAmount: number;
  // Add more fields based on your actual use case
}

// Extend React's Default Props (optional, if required by your project)
declare namespace React {
  interface Attributes {
    styleName?: string;
  }
}
