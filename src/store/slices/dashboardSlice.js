import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import API_ENDPOINTS from '../../services/apiEndpoints';

// Async thunks for dashboard metrics
export const fetchHomeMetrics = createAsyncThunk(
  'dashboard/fetchHomeMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.DASHBOARD.HOME_METRICS);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch home metrics');
    }
  }
);

export const fetchStockMetrics = createAsyncThunk(
  'dashboard/fetchStockMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.DASHBOARD.STOCK_METRICS);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch stock metrics');
    }
  }
);

const initialState = {
  homeMetrics: null,
  stockMetrics: null,
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMetrics: (state) => {
      state.homeMetrics = null;
      state.stockMetrics = null;
    },
  },
  extraReducers: (builder) => {
    // Home Metrics
    builder
      .addCase(fetchHomeMetrics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHomeMetrics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.homeMetrics = action.payload;
      })
      .addCase(fetchHomeMetrics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Stock Metrics
    builder
      .addCase(fetchStockMetrics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStockMetrics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stockMetrics = action.payload;
      })
      .addCase(fetchStockMetrics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearMetrics } = dashboardSlice.actions;
export default dashboardSlice.reducer;

