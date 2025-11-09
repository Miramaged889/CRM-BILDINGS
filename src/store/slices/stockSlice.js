import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import API_ENDPOINTS from '../../services/apiEndpoints';

export const fetchStock = createAsyncThunk(
  'stock/fetchStock',
  async (params = {}, { rejectWithValue }) => {
    try {
      // Build query parameters for filtering
      const queryParams = {};
      if (params.category) queryParams.category = params.category;
      if (params.status) queryParams.status = params.status;
      if (params.search) queryParams.search = params.search;

      const response = await api.get(API_ENDPOINTS.STOCK.LIST, { params: queryParams });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch stock');
    }
  }
);

export const fetchStockById = createAsyncThunk(
  'stock/fetchStockById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.STOCK.DETAIL(id));
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch stock item');
    }
  }
);

export const createStock = createAsyncThunk(
  'stock/createStock',
  async (stockData, { rejectWithValue }) => {
    try {
      // Create FormData for POST request
      const formData = new FormData();
      formData.append('name', stockData.name);
      if (stockData.description) formData.append('description', stockData.description);
      formData.append('category', stockData.category);
      formData.append('quantity', stockData.quantity);
      formData.append('lower_quantity', stockData.lower_quantity || stockData.minQuantity);
      formData.append('unit_of_measure', stockData.unit_of_measure || stockData.unit || 'Pieces');
      formData.append('unit_price', stockData.unit_price || stockData.unitPrice);
      if (stockData.supplier_name || stockData.supplier) {
        formData.append('supplier_name', stockData.supplier_name || stockData.supplier);
      }
      const autoDeductValue =
        stockData.auto_deduct_on_rent_end ?? stockData.autoDeduct;
      if (autoDeductValue !== undefined) {
        const autoDeduct = Boolean(autoDeductValue);
        formData.append('auto_deduct_on_rent_end', autoDeduct ? 'true' : 'false');
        formData.append(
          'rent_end_quantity',
          autoDeduct
            ? (stockData.rent_end_quantity ?? stockData.rentEndQuantity ?? 0)
            : 0
        );
      }

      const response = await api.post(API_ENDPOINTS.STOCK.CREATE, formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create stock item');
    }
  }
);

export const updateStock = createAsyncThunk(
  'stock/updateStock',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // Create FormData for PATCH request (form-data format)
      const formData = new FormData();
      if (data.quantity !== undefined) {
        formData.append('quantity', data.quantity);
      }
      if (data.unit_price !== undefined) {
        formData.append('unit_price', data.unit_price);
      }
      // Add other fields if needed
      if (data.name) formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      if (data.category) formData.append('category', data.category);
      if (data.lower_quantity !== undefined) formData.append('lower_quantity', data.lower_quantity);
      if (data.unit_of_measure) formData.append('unit_of_measure', data.unit_of_measure);
      if (data.supplier_name) formData.append('supplier_name', data.supplier_name);
      if (data.auto_deduct_on_rent_end !== undefined) {
        const autoDeduct = Boolean(data.auto_deduct_on_rent_end);
        formData.append('auto_deduct_on_rent_end', autoDeduct ? 'true' : 'false');
        formData.append(
          'rent_end_quantity',
          autoDeduct ? (data.rent_end_quantity ?? data.rentEndQuantity ?? 0) : 0
        );
      }

      const response = await api.patch(API_ENDPOINTS.STOCK.UPDATE(id), formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update stock item');
    }
  }
);

export const deleteStock = createAsyncThunk(
  'stock/deleteStock',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(API_ENDPOINTS.STOCK.DELETE(id));
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete stock item');
    }
  }
);

const initialState = {
  stock: [],
  currentItem: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentItem: (state) => {
      state.currentItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStock.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStock.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle both array response and object with data property
        const stockData = Array.isArray(action.payload) 
          ? action.payload 
          : (action.payload.data || action.payload.results || []);
        state.stock = stockData;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchStock.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchStockById.fulfilled, (state, action) => {
        state.currentItem = action.payload;
      })
      .addCase(createStock.fulfilled, (state, action) => {
        state.stock.push(action.payload);
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        const index = state.stock.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.stock[index] = action.payload;
        }
      })
      .addCase(deleteStock.fulfilled, (state, action) => {
        state.stock = state.stock.filter((s) => s.id !== action.payload);
      });
  },
});

export const { clearError, clearCurrentItem } = stockSlice.actions;
export default stockSlice.reducer;

