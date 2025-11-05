import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import API_ENDPOINTS from '../../services/apiEndpoints';

// Async thunks
export const fetchTenants = createAsyncThunk(
  'tenants/fetchTenants',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.TENANTS.LIST, { params });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch tenants');
    }
  }
);

export const fetchTenantById = createAsyncThunk(
  'tenants/fetchTenantById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.TENANTS.DETAIL(id));
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch tenant');
    }
  }
);

export const createTenant = createAsyncThunk(
  'tenants/createTenant',
  async (tenantData, { rejectWithValue }) => {
    try {
      const response = await api.post(API_ENDPOINTS.TENANTS.CREATE, tenantData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create tenant');
    }
  }
);

export const updateTenant = createAsyncThunk(
  'tenants/updateTenant',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(API_ENDPOINTS.TENANTS.UPDATE(id), data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update tenant');
    }
  }
);

export const deleteTenant = createAsyncThunk(
  'tenants/deleteTenant',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(API_ENDPOINTS.TENANTS.DELETE(id));
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete tenant');
    }
  }
);

export const searchTenants = createAsyncThunk(
  'tenants/searchTenants',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.TENANTS.SEARCH, { params: searchParams });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to search tenants');
    }
  }
);

const initialState = {
  tenants: [],
  currentTenant: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const tenantsSlice = createSlice({
  name: 'tenants',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTenant: (state) => {
      state.currentTenant = null;
    },
    setCurrentTenant: (state, action) => {
      state.currentTenant = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Tenants
    builder
      .addCase(fetchTenants.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTenants.fulfilled, (state, action) => {
        state.isLoading = false;
        const data = action.payload;
        // Backend returns paginated object { count, next, previous, results }
        if (data && Array.isArray(data.results)) {
          state.tenants = data.results;
          state.pagination.total = data.count ?? data.results.length;
        } else if (Array.isArray(data)) {
          state.tenants = data;
          state.pagination.total = data.length;
        } else {
          state.tenants = [];
          state.pagination.total = 0;
        }
      })
      .addCase(fetchTenants.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch Tenant By Id
    builder
      .addCase(fetchTenantById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTenantById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTenant = action.payload;
      })
      .addCase(fetchTenantById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create Tenant
    builder
      .addCase(createTenant.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTenant.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tenants.push(action.payload);
      })
      .addCase(createTenant.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update Tenant
    builder
      .addCase(updateTenant.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTenant.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.tenants.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tenants[index] = action.payload;
        }
        if (state.currentTenant?.id === action.payload.id) {
          state.currentTenant = action.payload;
        }
      })
      .addCase(updateTenant.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Delete Tenant
    builder
      .addCase(deleteTenant.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTenant.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tenants = state.tenants.filter((t) => t.id !== action.payload);
        if (state.currentTenant?.id === action.payload) {
          state.currentTenant = null;
        }
      })
      .addCase(deleteTenant.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Search Tenants
    builder
      .addCase(searchTenants.fulfilled, (state, action) => {
        const data = action.payload;
        if (data && Array.isArray(data.results)) {
          state.tenants = data.results;
          state.pagination.total = data.count ?? data.results.length;
        } else if (Array.isArray(data)) {
          state.tenants = data;
          state.pagination.total = data.length;
        } else {
          state.tenants = [];
          state.pagination.total = 0;
        }
      });
  },
});

export const { clearError, clearCurrentTenant, setCurrentTenant } = tenantsSlice.actions;
export default tenantsSlice.reducer;

