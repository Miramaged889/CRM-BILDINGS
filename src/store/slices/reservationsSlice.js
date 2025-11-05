import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import API_ENDPOINTS from '../../services/apiEndpoints';

export const fetchReservations = createAsyncThunk(
  'reservations/fetchReservations',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.RESERVATIONS.LIST, { params });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch reservations');
    }
  }
);

export const fetchReservationById = createAsyncThunk(
  'reservations/fetchReservationById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.RESERVATIONS.DETAIL(id));
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch reservation');
    }
  }
);

export const createReservation = createAsyncThunk(
  'reservations/createReservation',
  async (reservationData, { rejectWithValue }) => {
    try {
      const response = await api.post(API_ENDPOINTS.RESERVATIONS.CREATE, reservationData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create reservation');
    }
  }
);

export const updateReservation = createAsyncThunk(
  'reservations/updateReservation',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(API_ENDPOINTS.RESERVATIONS.UPDATE(id), data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update reservation');
    }
  }
);

export const deleteReservation = createAsyncThunk(
  'reservations/deleteReservation',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(API_ENDPOINTS.RESERVATIONS.DELETE(id));
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete reservation');
    }
  }
);

const initialState = {
  reservations: [],
  currentReservation: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentReservation: (state) => {
      state.currentReservation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reservations = action.payload.data || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchReservationById.fulfilled, (state, action) => {
        state.currentReservation = action.payload;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.reservations.push(action.payload);
      })
      .addCase(updateReservation.fulfilled, (state, action) => {
        const index = state.reservations.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.reservations[index] = action.payload;
        }
      })
      .addCase(deleteReservation.fulfilled, (state, action) => {
        state.reservations = state.reservations.filter((r) => r.id !== action.payload);
      });
  },
});

export const { clearError, clearCurrentReservation } = reservationsSlice.actions;
export default reservationsSlice.reducer;

