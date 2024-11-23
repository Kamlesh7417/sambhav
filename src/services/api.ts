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
  }
});

const transformDynamoDBResponse = (item: any): Order => ({
  order_id: item.order_id?.S || '',
  order_status: item.order_status?.S || 'Open',
  order_placed_timestamp: item.order_placed_timestamp?.S || new Date().toISOString(),
  customer: item.customer?.S,
  date: item.date?.S,
  type: item.type?.S,
  priority: item.priority?.S,
  origin: item.origin?.S,
  destination: item.destination?.S,
  items: item.items?.L?.map((i: any) => ({
    name: i.M.name.S || '',
    quantity: Number(i.M.quantity.N || 0),
    price: Number(i.M.price.N || 0)
  })) || [],
  total: item.total?.N ? Number(item.total.N) : undefined,
  customsInfo: item.customsInfo?.M ? {
    exportLicense: item.customsInfo.M.exportLicense.S || '',
    hsCode: item.customsInfo.M.hsCode.S || '',
    declaredValue: Number(item.customsInfo.M.declaredValue.N || 0)
  } : undefined
});

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get('/orders');
    const items = Array.isArray(response.data) ? response.data : [response.data];
    return items.map(transformDynamoDBResponse);
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
    return transformDynamoDBResponse(response.data);
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
        apiError.message = error.response.data?.message || 'Failed to fetch order';
        apiError.status = error.response.status;
      }
    }
    throw apiError;
  }
};
