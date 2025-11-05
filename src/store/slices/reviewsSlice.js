import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import API_ENDPOINTS from "../../services/apiEndpoints";

export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.REVIEWS.LIST, { params });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch reviews");
    }
  }
);

export const fetchReviewById = createAsyncThunk(
  "reviews/fetchReviewById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.REVIEWS.DETAIL(id));
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch review");
    }
  }
);

export const createReview = createAsyncThunk(
  "reviews/createReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await api.post(API_ENDPOINTS.REVIEWS.CREATE, reviewData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create review");
    }
  }
);

export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(API_ENDPOINTS.REVIEWS.UPDATE(id), data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update review"
      );
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(API_ENDPOINTS.REVIEWS.DELETE(id));
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete review"
      );
    }
  }
);

const initialState = {
  reviews: [],
  currentReview: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentReview: (state) => {
      state.currentReview = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle paginated response with results array
        if (action.payload.results && Array.isArray(action.payload.results)) {
          state.reviews = action.payload.results;
          state.pagination = {
            count: action.payload.count || 0,
            next: action.payload.next || null,
            previous: action.payload.previous || null,
          };
        } else if (Array.isArray(action.payload.data)) {
          state.reviews = action.payload.data;
        } else if (Array.isArray(action.payload)) {
          state.reviews = action.payload;
        } else {
          state.reviews = [];
        }
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchReviewById.fulfilled, (state, action) => {
        state.currentReview = action.payload;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        // Add new review only if it doesn't exist
        if (action.payload && action.payload.id) {
          const exists = state.reviews.some((r) => r.id === action.payload.id);
          if (!exists) {
            state.reviews.push(action.payload);
          }
        }
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        // Remove deleted review from state
        state.reviews = state.reviews.filter(
          (r) => r && r.id && r.id !== action.payload
        );
      });
  },
});

export const { clearError, clearCurrentReview } = reviewsSlice.actions;
export default reviewsSlice.reducer;
