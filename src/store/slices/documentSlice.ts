import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { generateMockDocuments } from '../../utils/mockData';

export interface Document {
  id: string;
  orderId: string;
  name: string;
  type: 'Invoice' | 'Shipping' | 'Customs' | 'Insurance' | 'Other';
  date: string;
  size: string;
  url: string;
  status: 'Draft' | 'Final' | 'Approved' | 'Rejected';
}

interface DocumentState {
  documents: Record<string, Document>;
  loading: boolean;
  error: string | null;
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

const initialState: DocumentState = {
  documents: generateMockDocuments(50), // Generate 50 documents
  loading: false,
  error: null,
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

export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return initialState.documents;
  }
);

const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    addDocument: (state, action) => {
      const document = action.payload;
      state.documents[document.id] = document;
    },
    removeDocument: (state, action) => {
      delete state.documents[action.payload];
    },
    updateDocument: (state, action) => {
      const { id, ...updates } = action.payload;
      if (state.documents[id]) {
        state.documents[id] = { ...state.documents[id], ...updates };
      }
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
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.documents = action.payload;
        state.loading = false;
        state.pagination.totalPages = Math.ceil(
          Object.keys(action.payload).length / state.pagination.itemsPerPage
        );
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch documents';
      });
  }
});

export const {
  addDocument,
  removeDocument,
  updateDocument,
  setPage,
  setFilters,
  clearFilters
} = documentSlice.actions;
export default documentSlice.reducer;