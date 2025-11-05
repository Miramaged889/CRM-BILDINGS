import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import API_ENDPOINTS from '../../services/apiEndpoints';

// Async thunks
export const fetchOwners = createAsyncThunk(
  'owners/fetchOwners',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.OWNERS.LIST, { params });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch owners');
    }
  }
);

export const fetchOwnerById = createAsyncThunk(
  'owners/fetchOwnerById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.OWNERS.DETAIL(id));
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch owner');
    }
  }
);

export const createOwner = createAsyncThunk(
  'owners/createOwner',
  async (ownerData, { rejectWithValue }) => {
    try {
      // Create FormData for POST request
      const formData = new FormData();
      formData.append('full_name', ownerData.full_name || ownerData.name);
      formData.append('email', ownerData.email);
      formData.append('phone', ownerData.phone);
      if (ownerData.address) formData.append('address', ownerData.address);
      if (ownerData.rate !== undefined) formData.append('rate', ownerData.rate);

      const response = await api.post(API_ENDPOINTS.OWNERS.CREATE, formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create owner');
    }
  }
);

export const updateOwner = createAsyncThunk(
  'owners/updateOwner',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // Create FormData for PATCH request (form-data format)
      const formData = new FormData();
      if (data.full_name || data.name) {
        formData.append('full_name', data.full_name || data.name);
      }
      if (data.email) formData.append('email', data.email);
      if (data.phone) formData.append('phone', data.phone);
      if (data.address !== undefined) formData.append('address', data.address || '');
      if (data.rate !== undefined) formData.append('rate', data.rate);

      const response = await api.patch(API_ENDPOINTS.OWNERS.UPDATE(id), formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update owner');
    }
  }
);

export const deleteOwner = createAsyncThunk(
  'owners/deleteOwner',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(API_ENDPOINTS.OWNERS.DELETE(id));
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete owner');
    }
  }
);

const initialState = {
  owners: [],
  currentOwner: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const ownersSlice = createSlice({
  name: 'owners',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOwner: (state) => {
      state.currentOwner = null;
    },
    setCurrentOwner: (state, action) => {
      state.currentOwner = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Owners
    builder
      .addCase(fetchOwners.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOwners.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle both array response and object with data property
        const ownersData = Array.isArray(action.payload) 
          ? action.payload 
          : (action.payload.data || action.payload.results || []);
        state.owners = ownersData;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchOwners.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch Owner By Id
    builder
      .addCase(fetchOwnerById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOwnerById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOwner = action.payload;
      })
      .addCase(fetchOwnerById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create Owner
    builder
      .addCase(createOwner.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOwner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.owners.push(action.payload);
      })
      .addCase(createOwner.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update Owner
    builder
      .addCase(updateOwner.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOwner.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.owners.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.owners[index] = action.payload;
        }
        if (state.currentOwner?.id === action.payload.id) {
          state.currentOwner = action.payload;
        }
      })
      .addCase(updateOwner.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Delete Owner
    builder
      .addCase(deleteOwner.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteOwner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.owners = state.owners.filter((o) => o.id !== action.payload);
        if (state.currentOwner?.id === action.payload) {
          state.currentOwner = null;
        }
      })
      .addCase(deleteOwner.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentOwner, setCurrentOwner } = ownersSlice.actions;
export default ownersSlice.reducer;

