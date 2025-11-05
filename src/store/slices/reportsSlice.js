import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import API_ENDPOINTS from '../../services/apiEndpoints';

export const fetchDashboardData = createAsyncThunk(
  'reports/fetchDashboardData',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.REPORTS.DASHBOARD, { params });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch dashboard data');
    }
  }
);

export const fetchRevenueReport = createAsyncThunk(
  'reports/fetchRevenueReport',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.REPORTS.REVENUE, { params });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch revenue report');
    }
  }
);

export const fetchOccupancyReport = createAsyncThunk(
  'reports/fetchOccupancyReport',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.REPORTS.OCCUPANCY, { params });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch occupancy report');
    }
  }
);

export const fetchPaymentsReport = createAsyncThunk(
  'reports/fetchPaymentsReport',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.REPORTS.PAYMENTS, { params });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch payments report');
    }
  }
);

const initialState = {
  dashboardData: null,
  revenueReport: null,
  occupancyReport: null,
  paymentsReport: null,
  isLoading: false,
  error: null,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearReports: (state) => {
      state.dashboardData = null;
      state.revenueReport = null;
      state.occupancyReport = null;
      state.paymentsReport = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchRevenueReport.fulfilled, (state, action) => {
        state.revenueReport = action.payload;
      })
      .addCase(fetchOccupancyReport.fulfilled, (state, action) => {
        state.occupancyReport = action.payload;
      })
      .addCase(fetchPaymentsReport.fulfilled, (state, action) => {
        state.paymentsReport = action.payload;
      });
  },
});

export const { clearError, clearReports } = reportsSlice.actions;
export default reportsSlice.reducer;

