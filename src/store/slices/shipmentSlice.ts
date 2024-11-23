import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { generateMockShipments } from '../../utils/mockData';

export interface ShipmentEvent {
  id: string;
  timestamp: string;
  location: string;
  status: string;
  description: string;
  type: 'pickup' | 'transit' | 'customs' | 'delivery' | 'exception' | 'negotiation';
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Communication {
  id: string;
  sender: string;
  role: 'carrier' | 'buyer' | 'seller' | 'agent';
  message: string;
  timestamp: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

export interface Shipment {
  id: string;
  orderId: string;
  origin: string;
  destination: string;
  status: 'Processing' | 'In Transit' | 'Delivered' | 'Cancelled';
  carrier: string;
  type: string;
  eta: string;
  lastUpdate: string;
  progress: number;
  tracking: ShipmentEvent[];
  communications: Communication[];
  coordinates: {
    origin: { lat: number; lng: number };
    destination: { lat: number; lng: number };
    current?: { lat: number; lng: number };
  };
}

interface ShipmentState {
  shipments: Record<string, Shipment>;
  loading: boolean;
  error: string | null;
  selectedShipmentId: string | null;
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

const initialState: ShipmentState = {
  shipments: generateMockShipments(15),
  loading: false,
  error: null,
  selectedShipmentId: null,
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

export const fetchShipments = createAsyncThunk(
  'shipments/fetchShipments',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return initialState.shipments;
  }
);

const shipmentSlice = createSlice({
  name: 'shipments',
  initialState,
  reducers: {
    selectShipment: (state, action) => {
      state.selectedShipmentId = action.payload;
    },
    clearSelectedShipment: (state) => {
      state.selectedShipmentId = null;
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
    },
    updateShipmentStatus: (state, action) => {
      const { shipmentId, status, progress, lastUpdate } = action.payload;
      if (state.shipments[shipmentId]) {
        state.shipments[shipmentId].status = status;
        state.shipments[shipmentId].progress = progress;
        state.shipments[shipmentId].lastUpdate = lastUpdate;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShipments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShipments.fulfilled, (state, action) => {
        state.shipments = action.payload;
        state.loading = false;
        state.pagination.totalPages = Math.ceil(
          Object.keys(action.payload).length / state.pagination.itemsPerPage
        );
      })
      .addCase(fetchShipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch shipments';
      });
  }
});

export const {
  selectShipment,
  clearSelectedShipment,
  setPage,
  setFilters,
  clearFilters,
  updateShipmentStatus
} = shipmentSlice.actions;
export default shipmentSlice.reducer;