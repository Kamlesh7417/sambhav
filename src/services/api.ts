import axios, { AxiosError } from 'axios';

export interface Order {
  order_id: string;
  order_status: string;
  order_placed_timestamp: string;
  customer?: string;
  date?: string;
  type?: string;
  priority?: string;
  origin?: string;
  destination?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total?: number;
  customsInfo?: {
    exportLicense: string;
    hsCode: string;
    declaredValue: number;
  };
}

export interface ApiError {
  message: string;
  status?: number;
  isConnectionError?: boolean;
}

const API_URL = 'https://susowh1c2f.execute-api.us-east-1.amazonaws.com/v1/orders';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Headers':'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    'Accept': 'application/json'
  },
});

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get('');
    return response.data.map((order: any) => ({
      order_id: order.order || '', // Mapping API field `order` to `order_id`
      order_status: order.status || 'Open', // Defaulting status to 'Open' if not provided
      order_placed_timestamp: order.Date || new Date().toISOString(), // Defaulting to current timestamp
      customer: order.customer,
      date: order.date,
      type: order.type,
      priority: order.priority,
      origin: order.origin,
      destination: order.destination,
      items: order.items,
      total: order.total,
      customsInfo: order.customsInfo,
    }));
  } catch (error) {
    const apiError: ApiError = {
      message: 'An error occurred while fetching orders',
      isConnectionError: false,
    };

    if (error instanceof AxiosError) {
      if (!error.response) {
        apiError.message =
          'Unable to connect to the server. Please check your connection and try again.';
        apiError.isConnectionError = true;
      } else {
        apiError.message =
          error.response.data?.message || 'Failed to fetch orders';
        apiError.status = error.response.status;
      }
    }

    throw apiError;
  }
};
