import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import API_ENDPOINTS from '../../services/apiEndpoints';

// Async thunks
export const fetchPayments = createAsyncThunk(
  'payments/fetchPayments',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.PAYMENTS.LIST, { params });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch payments');
    }
  }
);

export const fetchPaymentById = createAsyncThunk(
  'payments/fetchPaymentById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.PAYMENTS.DETAIL(id));
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch payment');
    }
  }
);

export const createPayment = createAsyncThunk(
  'payments/createPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await api.post(API_ENDPOINTS.PAYMENTS.CREATE, paymentData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create payment');
    }
  }
);

export const updatePayment = createAsyncThunk(
  'payments/updatePayment',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(API_ENDPOINTS.PAYMENTS.UPDATE(id), data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update payment');
    }
  }
);

export const deletePayment = createAsyncThunk(
  'payments/deletePayment',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(API_ENDPOINTS.PAYMENTS.DELETE(id));
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete payment');
    }
  }
);

export const fetchPaymentsByTenant = createAsyncThunk(
  'payments/fetchPaymentsByTenant',
  async (tenantId, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.PAYMENTS.BY_TENANT(tenantId));
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch payments');
    }
  }
);

export const fetchPaymentsByUnit = createAsyncThunk(
  'payments/fetchPaymentsByUnit',
  async (unitId, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.PAYMENTS.BY_UNIT(unitId));
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch payments');
    }
  }
);

// Unit Payments - New API
export const fetchUnitPayments = createAsyncThunk(
  'payments/fetchUnitPayments',
  async (unitId, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.PAYMENTS.GET_UNIT_PAYMENTS(unitId));
      return { unitId, data: response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch unit payments');
    }
  }
);

export const createOccasionalPayment = createAsyncThunk(
  'payments/createOccasionalPayment',
  async ({ unitId, paymentData }, { rejectWithValue }) => {
    try {
      // Create FormData for form-data submission
      const formData = new FormData();
      formData.append('category', paymentData.category);
      formData.append('amount', paymentData.amount);
      formData.append('payment_method', paymentData.payment_method);
      if (paymentData.notes) {
        formData.append('notes', paymentData.notes);
      }
      if (paymentData.payment_date) {
        formData.append('payment_date', paymentData.payment_date);
      }
      
      const response = await api.post(API_ENDPOINTS.PAYMENTS.CREATE_OCCASIONAL_PAYMENT(unitId), formData);
      return { unitId, payment: response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create payment');
    }
  }
);

export const updateOccasionalPayment = createAsyncThunk(
  'payments/updateOccasionalPayment',
  async ({ unitId, paymentId, paymentData }, { rejectWithValue }) => {
    try {
      // Use PATCH with JSON data (can use any field from POST)
      const response = await api.patch(
        API_ENDPOINTS.PAYMENTS.UPDATE_OCCASIONAL_PAYMENT(unitId, paymentId),
        paymentData
      );
      return { unitId, paymentId, payment: response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update payment');
    }
  }
);

export const deleteOccasionalPayment = createAsyncThunk(
  'payments/deleteOccasionalPayment',
  async ({ unitId, paymentId }, { rejectWithValue }) => {
    try {
      await api.delete(API_ENDPOINTS.PAYMENTS.DELETE_OCCASIONAL_PAYMENT(unitId, paymentId));
      return { unitId, paymentId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete payment');
    }
  }
);

// Company Payments
export const fetchCompanyRevenue = createAsyncThunk(
  'payments/fetchCompanyRevenue',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.PAYMENTS.COMPANY_REVENUE);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch company revenue');
    }
  }
);

export const payOwner = createAsyncThunk(
  'payments/payOwner',
  async ({ ownerId, amountPaid, notes }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('amount_paid', amountPaid);
      if (notes) {
        formData.append('notes', notes);
      }
      const response = await api.post(API_ENDPOINTS.PAYMENTS.PAY_OWNER(ownerId), formData);
      // API returns { id, owner, notes, date } but we need to add amount for display
      return { 
        ownerId, 
        payment: {
          ...response,
          amount: amountPaid, // Add amount for display
          amount_paid: amountPaid,
        }
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to pay owner');
    }
  }
);

export const fetchOwnerPayments = createAsyncThunk(
  'payments/fetchOwnerPayments',
  async (ownerId, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.PAYMENTS.GET_OWNER_PAYMENTS(ownerId));
      return { ownerId, data: response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch owner payments');
    }
  }
);

const initialState = {
  payments: [],
  currentPayment: null,
  unitPayments: {}, // Store payments by unitId
  companyRevenue: null,
  ownerPayments: {}, // Store full owner payment data by ownerId (includes stats, units, history)
  ownerPaymentsHistory: {}, // Store only payment history by ownerId
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payments = action.payload.data || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.currentPayment = action.payload;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.payments.push(action.payload);
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        const index = state.payments.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.payments[index] = action.payload;
        }
      })
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.payments = state.payments.filter((p) => p.id !== action.payload);
      })
      // Unit Payments
      .addCase(fetchUnitPayments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUnitPayments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.unitPayments[action.payload.unitId] = action.payload.data;
      })
      .addCase(fetchUnitPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createOccasionalPayment.fulfilled, (state, action) => {
        const { unitId, payment } = action.payload;
        if (!state.unitPayments[unitId]) {
          state.unitPayments[unitId] = [];
        }
        state.unitPayments[unitId].push(payment);
      })
      .addCase(updateOccasionalPayment.fulfilled, (state, action) => {
        const { unitId, paymentId, payment } = action.payload;
        if (state.unitPayments[unitId]) {
          const index = state.unitPayments[unitId].findIndex((p) => p.id === paymentId);
          if (index !== -1) {
            state.unitPayments[unitId][index] = payment;
          }
        }
      })
      .addCase(deleteOccasionalPayment.fulfilled, (state, action) => {
        const { unitId, paymentId } = action.payload;
        if (state.unitPayments[unitId]) {
          state.unitPayments[unitId] = state.unitPayments[unitId].filter((p) => p.id !== paymentId);
        }
      })
      // Company Revenue
      .addCase(fetchCompanyRevenue.fulfilled, (state, action) => {
        state.companyRevenue = action.payload;
      })
      // Owner Payments
      .addCase(fetchOwnerPayments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOwnerPayments.fulfilled, (state, action) => {
        state.isLoading = false;
        const { ownerId, data } = action.payload;
        state.ownerPayments[ownerId] = data;
        // Also store payment history separately for easier access
        if (data.payments_history) {
          state.ownerPaymentsHistory[ownerId] = data.payments_history;
        }
      })
      .addCase(fetchOwnerPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(payOwner.fulfilled, (state, action) => {
        const { ownerId, payment } = action.payload;
        // Add to payment history if it exists
        if (!state.ownerPaymentsHistory[ownerId]) {
          state.ownerPaymentsHistory[ownerId] = [];
        }
        state.ownerPaymentsHistory[ownerId].unshift(payment);
        // Update owner payment data if it exists
        if (state.ownerPayments[ownerId]) {
          state.ownerPayments[ownerId].payments_history = [
            payment,
            ...(state.ownerPayments[ownerId].payments_history || []),
          ];
          // Update paid totals
          if (state.ownerPayments[ownerId].paid_to_owner_total) {
            state.ownerPayments[ownerId].paid_to_owner_total = (
              parseFloat(state.ownerPayments[ownerId].paid_to_owner_total) +
              parseFloat(payment.amount || payment.amount_paid || 0)
            ).toFixed(2);
          }
          if (state.ownerPayments[ownerId].still_need_to_pay) {
            state.ownerPayments[ownerId].still_need_to_pay = (
              parseFloat(state.ownerPayments[ownerId].still_need_to_pay) -
              parseFloat(payment.amount || payment.amount_paid || 0)
            ).toFixed(2);
          }
        }
      });
  },
});

export const { clearError, clearCurrentPayment } = paymentsSlice.actions;
export default paymentsSlice.reducer;

