import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Order {
  order_id: string;
  order_status: string;
  order_placed_timestamp: string;
}

interface OrderState {
  orders: Record<string, Order>;
  loading: boolean;
  error: string | null;
  selectedOrderId: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
  };
  filters: {
    dateRange: 'today' | 'yesterday' | 'week' | 'month' | 'custom' | null;
    customDateRange: {
      start: string | null;
      end: string | null;
    };
    status: string | null;
    search: string;
  };
}

const initialState: OrderState = {
  orders: {},
  loading: false,
  error: null,
  selectedOrderId: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10
  },
  filters: {
    dateRange: null,
    customDateRange: {
      start: null,
      end: null
    },
    status: null,
    search: ''
  }
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async () => {
    const response = await fetch('https://susowh1c2f.execute-api.us-east-1.amazonaws.com/v1/orders');
    const data = await response.json();
    return data.map((order: Order) => ({
      ...order,
      order_status: order.order_status || 'Open'
    }));
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    selectOrder: (state, action) => {
      state.selectedOrderId = action.payload;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrderId = null;
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.currentPage = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload.reduce((acc: Record<string, Order>, order: Order) => {
          acc[order.order_id] = order;
          return acc;
        }, {});
        state.loading = false;
        state.pagination.totalPages = Math.ceil(
          Object.keys(action.payload).length / state.pagination.itemsPerPage
        );
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      });
  }
});

export const { selectOrder, clearSelectedOrder, setPage, setFilters, clearFilters } = orderSlice.actions;
export default orderSlice.reducer;