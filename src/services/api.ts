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

const API_URL = 'https://9jhvnrb7y2.execute-api.us-east-1.amazonaws.com/dev/orders';

const api = axios.create({
  //baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers':'*',
    'Access-Control-Allow-Methods':'*',
    'Access-Control-Origin-Headers':'*'
  }
});

const transformDynamoDBResponse = (data: any): Order => {
  // If data is a string (from the body field), parse it
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data.replace(/'/g, '"'));
    } catch (e) {
      console.error('Error parsing response:', e);
    }
  }

  // If there's a body field in the data, use that instead
  if (data.body) {
    try {
      data = JSON.parse(data.body.replace(/'/g, '"'));
    } catch (e) {
      console.error('Error parsing body:', e);
    }
  }

  return {
    order_id: data.order_id?.S || '',
    order_status: data.order_status?.S || 'Open',
    order_placed_timestamp: data.order_placed_timestamp?.S || new Date().toISOString(),
    customer: data.customer?.S,
    date: data.date?.S,
    type: data.type?.S,
    priority: data.priority?.S,
    origin: data.origin?.S,
    destination: data.destination?.S,
    items: data.items?.L?.map((item: any) => ({
      name: item.M.name.S || '',
      quantity: Number(item.M.quantity.N || 0),
      price: Number(item.M.price.N || 0)
    })) || [],
    total: data.total?.N ? Number(data.total.N) : undefined,
    customsInfo: data.customsInfo?.M ? {
      exportLicense: data.customsInfo.M.exportLicense.S || '',
      hsCode: data.customsInfo.M.hsCode.S || '',
      declaredValue: Number(data.customsInfo.M.declaredValue.N || 0)
    } : undefined
  };
};

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get(API_URL);
    console.log('API Response:', response);
    
    const items = Array.isArray(response.data) ? response.data : [response.data];
    return items.map(transformDynamoDBResponse);
  } catch (error) {
    console.error('API Error:', error);
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

