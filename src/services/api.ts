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

const API_URL = 'https://susowh1c2f.execute-api.us-east-1.amazonaws.com/v1';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // Enable if you need cookies to be sent
});

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = {
      message: 'An error occurred while fetching orders',
      isConnectionError: false,
    };

    if (error instanceof AxiosError) {
      if (!error.response) {
        apiError.message = 'Unable to connect to the server. Please check your connection and try again.';
        apiError.isConnectionError = true;
      } else {
        apiError.message = error.response.data?.message || 'Failed to fetch orders';
        apiError.status = error.response.status;
      }
    }
    return Promise.reject(apiError);
  }
);

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get('/orders');
    
    // Ensure we have an array to map over
    const ordersData = Array.isArray(response.data) ? response.data : [response.data];
    
    return ordersData.map((order: any) => ({
      order_id: order.order_id || '', // Updated to match DynamoDB field name
      order_status: order.order_status || 'Open',
      order_placed_timestamp: order.order_placed_timestamp || new Date().toISOString(),
      customer: order.customer,
      date: order.date,
      type: order.type,
      priority: order.priority,
      origin: order.origin,
      destination: order.destination,
      items: Array.isArray(order.items) ? order.items : [],
      total: typeof order.total === 'number' ? order.total : 0,
      customsInfo: order.customsInfo || null
    }));
  } catch (error) {
    // If the error is already formatted by our interceptor, just throw it
    if ((error as ApiError).isConnectionError !== undefined) {
      throw error;
    }
    
    // Otherwise, format it
    const apiError: ApiError = {
      message: 'An unexpected error occurred while fetching orders',
      isConnectionError: false,
    };
    throw apiError;
  }
};

// Function to fetch a single order
export const fetchOrderById = async (orderId: string): Promise<Order> => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    const order = response.data;
    
    return {
      order_id: order.order_id || '',
      order_status: order.order_status || 'Open',
      order_placed_timestamp: order.order_placed_timestamp || new Date().toISOString(),
      customer: order.customer,
      date: order.date,
      type: order.type,
      priority: order.priority,
      origin: order.origin,
      destination: order.destination,
      items: Array.isArray(order.items) ? order.items : [],
      total: typeof order.total === 'number' ? order.total : 0,
      customsInfo: order.customsInfo || null
    };
  } catch (error) {
    if ((error as ApiError).isConnectionError !== undefined) {
      throw error;
    }
    
    const apiError: ApiError = {
      message: 'An error occurred while fetching the order',
      isConnectionError: false,
    };
    
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        apiError.message = 'Order not found';
      }
      apiError.status = error.response?.status;
    }
    
    throw apiError;
  }
};
