import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import API_ENDPOINTS from '../../services/apiEndpoints';

// Async thunks
export const fetchUnits = createAsyncThunk(
  'units/fetchUnits',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.UNITS.LIST, { params });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch units');
    }
  }
);

export const fetchUnitById = createAsyncThunk(
  'units/fetchUnitById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.UNITS.DETAIL(id));
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch unit');
    }
  }
);

export const createUnit = createAsyncThunk(
  'units/createUnit',
  async (unitData, { rejectWithValue }) => {
    try {
      // Create FormData for POST request
      const formData = new FormData();
      
      // Required fields
      formData.append('name', unitData.name);
      formData.append('location_url', unitData.location_url);
      formData.append('location_text', unitData.location_text);
      formData.append('owner', unitData.owner);
      formData.append('city', unitData.city);
      formData.append('district', unitData.district);
      formData.append('owner_percentage', unitData.owner_percentage);
      formData.append('type', unitData.type);
      formData.append('bedrooms', unitData.bedrooms);
      formData.append('bathrooms', unitData.bathrooms);
      formData.append('area', unitData.area);
      formData.append('lease_start', unitData.lease_start);
      formData.append('lease_end', unitData.lease_end);
      
      // Optional fields
      if (unitData.price_per_day !== undefined && unitData.price_per_day !== '') {
        formData.append('price_per_day', unitData.price_per_day);
      }
      if (unitData.status) {
        formData.append('status', unitData.status);
      }
      
      // Append images (at least 1, at most 10)
      if (unitData.images && unitData.images.length > 0) {
        unitData.images.forEach((image) => {
          if (image instanceof File) {
            formData.append('images', image);
          }
        });
      }

      const response = await api.post(API_ENDPOINTS.UNITS.CREATE, formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create unit');
    }
  }
);

export const updateUnit = createAsyncThunk(
  'units/updateUnit',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // Create FormData for PATCH request
      const formData = new FormData();
      
      // All fields from POST can be updated, but most common:
      if (data.owner_percentage !== undefined) {
        formData.append('owner_percentage', data.owner_percentage);
      }
      if (data.status) {
        formData.append('status', data.status);
      }
      if (data.name) formData.append('name', data.name);
      if (data.location_url) formData.append('location_url', data.location_url);
      if (data.location_text) formData.append('location_text', data.location_text);
      if (data.owner !== undefined) formData.append('owner', data.owner);
      if (data.city !== undefined) formData.append('city', data.city);
      if (data.district !== undefined) formData.append('district', data.district);
      if (data.type) formData.append('type', data.type);
      if (data.bedrooms !== undefined) formData.append('bedrooms', data.bedrooms);
      if (data.bathrooms !== undefined) formData.append('bathrooms', data.bathrooms);
      if (data.area !== undefined) formData.append('area', data.area);
      if (data.lease_start) formData.append('lease_start', data.lease_start);
      if (data.lease_end) formData.append('lease_end', data.lease_end);
      if (data.price_per_day !== undefined && data.price_per_day !== '') {
        formData.append('price_per_day', data.price_per_day);
      }
      
      // Append new images if provided
      if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
          if (image instanceof File) {
            formData.append('images', image);
          }
        });
      }

      const response = await api.patch(API_ENDPOINTS.UNITS.UPDATE(id), formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update unit');
    }
  }
);

export const fetchUnitPayments = createAsyncThunk(
  'units/fetchUnitPayments',
  async (unitId, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.UNITS.PAYMENTS(unitId));
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch unit payments');
    }
  }
);

export const deleteUnit = createAsyncThunk(
  'units/deleteUnit',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(API_ENDPOINTS.UNITS.DELETE(id));
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete unit');
    }
  }
);

const initialState = {
  units: [],
  currentUnit: null,
  unitPayments: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const unitsSlice = createSlice({
  name: 'units',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentUnit: (state) => {
      state.currentUnit = null;
    },
    setCurrentUnit: (state, action) => {
      state.currentUnit = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Units
    builder
      .addCase(fetchUnits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUnits.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle paginated response with results array
        const unitsData = action.payload.results || action.payload.data || action.payload;
        state.units = Array.isArray(unitsData) ? unitsData : [];
        if (action.payload.count !== undefined) {
          state.pagination.total = action.payload.count;
        }
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchUnits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch Unit By Id
    builder
      .addCase(fetchUnitById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUnitById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUnit = action.payload;
      })
      .addCase(fetchUnitById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create Unit
    builder
      .addCase(createUnit.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUnit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.units.push(action.payload);
      })
      .addCase(createUnit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update Unit
    builder
      .addCase(updateUnit.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUnit.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.units.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.units[index] = action.payload;
        }
        if (state.currentUnit?.id === action.payload.id) {
          state.currentUnit = action.payload;
        }
      })
      .addCase(updateUnit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Delete Unit
    builder
      .addCase(deleteUnit.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUnit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.units = state.units.filter((u) => u.id !== action.payload);
        if (state.currentUnit?.id === action.payload) {
          state.currentUnit = null;
        }
      })
      .addCase(deleteUnit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch Unit Payments
    builder
      .addCase(fetchUnitPayments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUnitPayments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.unitPayments = action.payload;
      })
      .addCase(fetchUnitPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentUnit, setCurrentUnit } = unitsSlice.actions;
export default unitsSlice.reducer;

