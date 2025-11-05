import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import API_ENDPOINTS from '../../services/apiEndpoints';

export const fetchContracts = createAsyncThunk(
  'contracts/fetchContracts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.CONTRACTS.LIST, { params });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch contracts');
    }
  }
);

export const fetchContractById = createAsyncThunk(
  'contracts/fetchContractById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.CONTRACTS.DETAIL(id));
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch contract');
    }
  }
);

export const createContract = createAsyncThunk(
  'contracts/createContract',
  async (contractData, { rejectWithValue }) => {
    try {
      const response = await api.post(API_ENDPOINTS.CONTRACTS.CREATE, contractData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create contract');
    }
  }
);

export const updateContract = createAsyncThunk(
  'contracts/updateContract',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(API_ENDPOINTS.CONTRACTS.UPDATE(id), data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update contract');
    }
  }
);

export const deleteContract = createAsyncThunk(
  'contracts/deleteContract',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(API_ENDPOINTS.CONTRACTS.DELETE(id));
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete contract');
    }
  }
);

const initialState = {
  contracts: [],
  currentContract: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const contractsSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentContract: (state) => {
      state.currentContract = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContracts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contracts = action.payload.data || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchContractById.fulfilled, (state, action) => {
        state.currentContract = action.payload;
      })
      .addCase(createContract.fulfilled, (state, action) => {
        state.contracts.push(action.payload);
      })
      .addCase(updateContract.fulfilled, (state, action) => {
        const index = state.contracts.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.contracts[index] = action.payload;
        }
      })
      .addCase(deleteContract.fulfilled, (state, action) => {
        state.contracts = state.contracts.filter((c) => c.id !== action.payload);
      });
  },
});

export const { clearError, clearCurrentContract } = contractsSlice.actions;
export default contractsSlice.reducer;

