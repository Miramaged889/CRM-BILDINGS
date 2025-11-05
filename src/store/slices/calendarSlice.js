import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import API_ENDPOINTS from '../../services/apiEndpoints';

export const fetchCalendarEvents = createAsyncThunk(
  'calendar/fetchCalendarEvents',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.CALENDAR.EVENTS, { params });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch calendar events');
    }
  }
);

export const createCalendarEvent = createAsyncThunk(
  'calendar/createCalendarEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await api.post(API_ENDPOINTS.CALENDAR.CREATE_EVENT, eventData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create calendar event');
    }
  }
);

export const updateCalendarEvent = createAsyncThunk(
  'calendar/updateCalendarEvent',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(API_ENDPOINTS.CALENDAR.UPDATE_EVENT(id), data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update calendar event');
    }
  }
);

export const deleteCalendarEvent = createAsyncThunk(
  'calendar/deleteCalendarEvent',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(API_ENDPOINTS.CALENDAR.DELETE_EVENT(id));
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete calendar event');
    }
  }
);

const initialState = {
  events: [],
  currentEvent: null,
  isLoading: false,
  error: null,
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalendarEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCalendarEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload.data || action.payload;
      })
      .addCase(fetchCalendarEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createCalendarEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
      .addCase(updateCalendarEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(deleteCalendarEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((e) => e.id !== action.payload);
      });
  },
});

export const { clearError, clearCurrentEvent } = calendarSlice.actions;
export default calendarSlice.reducer;

