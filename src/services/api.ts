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
    'Content-Type': 'application/json'
  },
  withCredentials: false // Changed to false since we're not using cookies
});

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get('/orders');
    
    // Ensure we have an array to map over
    const ordersData = Array.isArray(response.data) ? response.data : [response.data];
    
    return ordersData.map((order: any) => ({
      order_id: order.order_id?.S || '', // Handle DynamoDB string type
      order_status: order.order_status?.S || 'Open',
      order_placed_timestamp: order.order_placed_timestamp?.S || new Date().toISOString(),
      customer: order.customer?.S,
      date: order.date?.S,
      type: order.type?.S,
      priority: order.priority?.S,
      origin: order.origin?.S,
      destination: order.destination?.S,
      items: order.items?.L?.map((item: any) => ({
        name: item.M.name.S,
        quantity: parseInt(item.M.quantity.N),
        price: parseFloat(item.M.price.N)
      })) || [],
      total: order.total?.N ? parseFloat(order.total.N) : 0,
      customsInfo: order.customsInfo?.M ? {
        exportLicense: order.customsInfo.M.exportLicense.S,
        hsCode: order.customsInfo.M.hsCode.S,
        declaredValue: parseFloat(order.customsInfo.M.declaredValue.N)
      } : null
    }));
  } catch (error) {
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
    throw apiError;
  }
};

export const fetchOrderById = async (orderId: string): Promise<Order> => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    const order = response.data;
    
    return {
      order_id: order.order_id?.S || '',
      order_status: order.order_status?.S || 'Open',
      order_placed_timestamp: order.order_placed_timestamp?.S || new Date().toISOString(),
      customer: order.customer?.S,
      date: order.date?.S,
      type: order.type?.S,
      priority: order.priority?.S,
      origin: order.origin?.S,
      destination: order.destination?.S,
      items: order.items?.L?.map((item: any) => ({
        name: item.M.name.S,
        quantity: parseInt(item.M.quantity.N),
        price: parseFloat(item.M.price.N)
      })) || [],
      total: order.total?.N ? parseFloat(order.total.N) : 0,
      customsInfo: order.customsInfo?.M ? {
        exportLicense: order.customsInfo.M.exportLicense.S,
        hsCode: order.customsInfo.M.hsCode.S,
        declaredValue: parseFloat(order.customsInfo.M.declaredValue.N)
      } : null
    };
  } catch (error) {
    const apiError: ApiError = {
      message: 'An error occurred while fetching the order',
      isConnectionError: false,
    };

    if (error instanceof AxiosError) {
      if (!error.response) {
        apiError.message = 'Unable to connect to the server. Please check your connection and try again.';
        apiError.isConnectionError = true;
      } else if (error.response.status === 404) {
        apiError.message = 'Order not found';
      }
      apiError.status = error.response.status;
    }
    throw apiError;
  }
};
