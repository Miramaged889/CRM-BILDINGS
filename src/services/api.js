import axios from "axios";
import API_ENDPOINTS from "./apiEndpoints";

// Create axios instance
const api = axios.create({
  baseURL: "https://rscrm.pythonanywhere.com/",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If data is FormData, remove Content-Type header to let axios set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;

      // Handle 401 Unauthorized - logout user
      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }

      // Return error message
      return Promise.reject({
        message: data?.message || error.message,
        status: status,
        data: data,
      });
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({
        message: "Network error. Please check your connection.",
        status: 0,
      });
    } else {
      // Something else happened
      return Promise.reject({
        message: error.message || "An unexpected error occurred",
        status: 0,
      });
    }
  }
);

export default api;

// Rents API helpers
export const createRent = async (formData) => {
  // formData should be FormData for file upload; interceptor handles headers
  return api.post(API_ENDPOINTS.RENTS.CREATE, formData);
};

export const getRents = async (params = {}) => {
  // params can include { unit, tenant }
  return api.get(API_ENDPOINTS.RENTS.LIST, { params });
};

export const getRentDetail = async (id) => {
  return api.get(API_ENDPOINTS.RENTS.DETAIL(id));
};

export const deleteRent = async (id) => {
  return api.delete(API_ENDPOINTS.RENTS.DETAIL(id));
};

export const updateRent = async (id, formData) => {
  // Partial update via PATCH; formData can include only changed fields (e.g., total_amount)
  return api.patch(API_ENDPOINTS.RENTS.UPDATE(id), formData);
};

// Occasional Payments
export const getOccasionalPayments = async (params = {}) => {
  return api.get(API_ENDPOINTS.PAYMENTS.GET_OCCASIONAL_PAYMENTS, { params });
};

// Notifications
export const getNotifications = async (params = {}) => {
  return api.get(API_ENDPOINTS.NOTIFICATIONS.LIST, { params });
};
