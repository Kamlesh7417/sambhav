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

// DynamoDB response types
interface DynamoDBItem {
  S?: string;
  N?: string;
  L?: Array<any>;
  M?: Record<string, any>;
}

interface DynamoDBOrder {
  order_id: DynamoDBItem;
  order_status: DynamoDBItem;
  order_placed_timestamp: DynamoDBItem;
  customer?: DynamoDBItem;
  date?: DynamoDBItem;
  type?: DynamoDBItem;
  priority?: DynamoDBItem;
  origin?: DynamoDBItem;
  destination?: DynamoDBItem;
  items?: DynamoDBItem;
  total?: DynamoDBItem;
  customsInfo?: DynamoDBItem;
}

const API_URL = 'https://susowh1c2f.execute-api.us-east-1.amazonaws.com/v1';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false
});

const transformDynamoDBOrder = (order: DynamoDBOrder): Order => ({
  order_id: order.order_id?.S || '',
  order_status: order.order_status?.S || 'Open',
  order_placed_timestamp: order.order_placed_timestamp?.S || new Date().toISOString(),
  customer: order.customer?.S,
  date: order.date?.S,
  type: order.type?.S,
  priority: order.priority?.S,
  origin: order.origin?.S,
  destination: order.destination?.S,
  items: order.items?.L?.map(item => ({
    name: item.M.name.S || '',
    quantity: parseInt(item.M.quantity.N || '0'),
    price: parseFloat(item.M.price.N || '0')
  })),
  total: order.total?.N ? parseFloat(order.total.N) : undefined,
  customsInfo: order.customsInfo?.M ? {
    exportLicense: order.customsInfo.M.exportLicense.S || '',
    hsCode: order.customsInfo.M.hsCode.S || '',
    declaredValue: parseFloat(order.customsInfo.M.declaredValue.N || '0')
  } : undefined
});

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get('/orders');
    const ordersData: DynamoDBOrder[] = Array.isArray(response.data) ? response.data : [response.data];
    return ordersData.map(transformDynamoDBOrder);
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
    const orderData: DynamoDBOrder = response.data;
    return transformDynamoDBOrder(orderData);
  } catch (error) {
    const apiError: ApiError = {
      message: 'An error occurred while fetching the order',
      isConnectionError: false,
    };

    if (error instanceof AxiosError) {
      if (!error.response) {
        apiError.message = 'Unable to connect to the server. Please check your connection and try again.';
        apiError.isConnectionError = true;
      } else {
        apiError.message = error.response?.data?.message || 'Failed to fetch order';
        apiError.status = error.response?.status;
      }
    }
    throw apiError;
  }
};
