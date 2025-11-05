import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import API_ENDPOINTS from '../../services/apiEndpoints';

export const fetchLeases = createAsyncThunk(
  'leases/fetchLeases',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.LEASES.LIST, { params });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch leases');
    }
  }
);

export const fetchLeaseById = createAsyncThunk(
  'leases/fetchLeaseById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.LEASES.DETAIL(id));
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch lease');
    }
  }
);

export const createLease = createAsyncThunk(
  'leases/createLease',
  async (leaseData, { rejectWithValue }) => {
    try {
      const response = await api.post(API_ENDPOINTS.LEASES.CREATE, leaseData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create lease');
    }
  }
);

export const updateLease = createAsyncThunk(
  'leases/updateLease',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(API_ENDPOINTS.LEASES.UPDATE(id), data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update lease');
    }
  }
);

export const deleteLease = createAsyncThunk(
  'leases/deleteLease',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(API_ENDPOINTS.LEASES.DELETE(id));
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete lease');
    }
  }
);

const initialState = {
  leases: [],
  currentLease: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const leasesSlice = createSlice({
  name: 'leases',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentLease: (state) => {
      state.currentLease = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeases.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeases.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leases = action.payload.data || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchLeases.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchLeaseById.fulfilled, (state, action) => {
        state.currentLease = action.payload;
      })
      .addCase(createLease.fulfilled, (state, action) => {
        state.leases.push(action.payload);
      })
      .addCase(updateLease.fulfilled, (state, action) => {
        const index = state.leases.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) {
          state.leases[index] = action.payload;
        }
      })
      .addCase(deleteLease.fulfilled, (state, action) => {
        state.leases = state.leases.filter((l) => l.id !== action.payload);
      });
  },
});

export const { clearError, clearCurrentLease } = leasesSlice.actions;
export default leasesSlice.reducer;

