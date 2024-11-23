import axios, { AxiosError } from 'axios';

// ... (keep your interfaces the same)

const API_URL = 'https://susowh1c2f.execute-api.us-east-1.amazonaws.com/v1';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Enable this since we're using credentials in CORS
});

// ... (keep your transformation functions the same)

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get('/orders');
    console.log('API Response:', response); // Add this for debugging
    const items = Array.isArray(response.data) ? response.data : [response.data];
    return items.map(transformDynamoDBResponse);
  } catch (error) {
    console.error('API Error:', error); // Add this for debugging
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

// ... (keep fetchOrderById the same)
