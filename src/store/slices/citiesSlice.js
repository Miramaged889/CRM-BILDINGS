import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import API_ENDPOINTS from '../../services/apiEndpoints';

// Async thunks
export const fetchCities = createAsyncThunk(
  'cities/fetchCities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.CITIES.LIST);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch cities');
    }
  }
);

export const fetchDistricts = createAsyncThunk(
  'districts/fetchDistricts',
  async (cityId = null, { rejectWithValue }) => {
    try {
      const params = cityId ? { city: cityId } : {};
      const response = await api.get(API_ENDPOINTS.DISTRICTS.LIST, { params });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch districts');
    }
  }
);

// City CRUD operations
export const createCity = createAsyncThunk(
  'cities/createCity',
  async (cityData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('name', cityData.name);
      
      const response = await api.post(API_ENDPOINTS.CITIES.CREATE, formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create city');
    }
  }
);

export const updateCity = createAsyncThunk(
  'cities/updateCity',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (data.name !== undefined) {
        formData.append('name', data.name);
      }
      
      const response = await api.patch(API_ENDPOINTS.CITIES.UPDATE(id), formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update city');
    }
  }
);

export const deleteCity = createAsyncThunk(
  'cities/deleteCity',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(API_ENDPOINTS.CITIES.DELETE(id));
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete city');
    }
  }
);

// District CRUD operations
export const createDistrict = createAsyncThunk(
  'districts/createDistrict',
  async (districtData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('name', districtData.name);
      formData.append('city', districtData.city);
      
      const response = await api.post(API_ENDPOINTS.DISTRICTS.CREATE, formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create district');
    }
  }
);

export const updateDistrict = createAsyncThunk(
  'districts/updateDistrict',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (data.name !== undefined) {
        formData.append('name', data.name);
      }
      if (data.city !== undefined) {
        formData.append('city', data.city);
      }
      
      const response = await api.patch(API_ENDPOINTS.DISTRICTS.UPDATE(id), formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update district');
    }
  }
);

export const deleteDistrict = createAsyncThunk(
  'districts/deleteDistrict',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(API_ENDPOINTS.DISTRICTS.DELETE(id));
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete district');
    }
  }
);

const initialState = {
  cities: [],
  districts: [],
  isLoading: false,
  error: null,
};

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearDistricts: (state) => {
      state.districts = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Cities
    builder
      .addCase(fetchCities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.isLoading = false;
        const citiesData = Array.isArray(action.payload)
          ? action.payload
          : (action.payload.data || action.payload.results || []);
        state.cities = citiesData;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch Districts
    builder
      .addCase(fetchDistricts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDistricts.fulfilled, (state, action) => {
        state.isLoading = false;
        const districtsData = Array.isArray(action.payload)
          ? action.payload
          : (action.payload.data || action.payload.results || []);
        state.districts = districtsData;
      })
      .addCase(fetchDistricts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create City
    builder
      .addCase(createCity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cities.push(action.payload);
      })
      .addCase(createCity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update City
    builder
      .addCase(updateCity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCity.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.cities.findIndex(city => city.id === action.payload.id);
        if (index !== -1) {
          state.cities[index] = action.payload;
        }
      })
      .addCase(updateCity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Delete City
    builder
      .addCase(deleteCity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cities = state.cities.filter(city => city.id !== action.payload);
      })
      .addCase(deleteCity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create District
    builder
      .addCase(createDistrict.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createDistrict.fulfilled, (state, action) => {
        state.isLoading = false;
        state.districts.push(action.payload);
      })
      .addCase(createDistrict.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update District
    builder
      .addCase(updateDistrict.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDistrict.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.districts.findIndex(district => district.id === action.payload.id);
        if (index !== -1) {
          state.districts[index] = action.payload;
        }
      })
      .addCase(updateDistrict.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Delete District
    builder
      .addCase(deleteDistrict.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDistrict.fulfilled, (state, action) => {
        state.isLoading = false;
        state.districts = state.districts.filter(district => district.id !== action.payload);
      })
      .addCase(deleteDistrict.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearDistricts } = citiesSlice.actions;
export default citiesSlice.reducer;

