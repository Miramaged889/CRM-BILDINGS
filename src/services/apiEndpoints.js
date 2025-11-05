// API Endpoints Configuration
const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login/",
    LOGOUT: "/auth/refresh/",
    REFRESH_TOKEN: "/auth/refresh/",
    ME: "/auth/me/",
  },

  // Units
  UNITS: {
    LIST: "/api/units/",
    DETAIL: (id) => `/api/units/${id}/`,
    CREATE: "/api/units/",
    UPDATE: (id) => `/api/units/${id}/`,
    DELETE: (id) => `/api/units/${id}/`,
    PAYMENTS: (id) => `/api/all/payments/unit/${id}/`,
  },

  // Tenants
  TENANTS: {
    LIST: "/api/tenants/",
    DETAIL: (id) => `/api/tenants/${id}/`,
    CREATE: "/api/tenants/",
    UPDATE: (id) => `/api/tenants/${id}/`,
    DELETE: (id) => `/api/tenants/${id}/`,
    SEARCH: "/api/tenants/", // use with params { search }
  },

  // Owners
  OWNERS: {
    LIST: "/api/owners/",
    DETAIL: (id) => `/api/owners/${id}/`,
    CREATE: "/api/owners/",
    UPDATE: (id) => `/api/owners/${id}/`,
    DELETE: (id) => `/api/owners/${id}/`,
  },

  // Payments
  PAYMENTS: {
    // Unit Payments
    GET_UNIT_PAYMENTS: (unitId) => `/api/all/payments/unit/${unitId}/`,
    CREATE_OCCASIONAL_PAYMENT: (unitId) => `/api/occasional/payments/unit/${unitId}/`,
    UPDATE_OCCASIONAL_PAYMENT: (unitId, paymentId) => `/api/occasional/payments/unit/${unitId}/${paymentId}/`,
    DELETE_OCCASIONAL_PAYMENT: (unitId, paymentId) => `/api/occasional/payments/unit/${unitId}/${paymentId}/`,
    
    // Company Payments
    COMPANY_REVENUE: "/api/all/payments/me/",
    PAY_OWNER: (ownerId) => `/api/payments/owner/${ownerId}/pay/`,
    GET_OWNER_PAYMENTS: (ownerId) => `/api/all/payments/owner/${ownerId}/`,
    
    // Legacy endpoints (keep for backward compatibility)
    LIST: "/payments",
    DETAIL: (id) => `/payments/${id}`,
    CREATE: "/payments",
    UPDATE: (id) => `/payments/${id}`,
    DELETE: (id) => `/payments/${id}`,
    BY_TENANT: (tenantId) => `/payments/tenant/${tenantId}`,
    BY_UNIT: (unitId) => `/payments/unit/${unitId}`,
  },

  // Stock
  STOCK: {
    LIST: "/api/stock/",
    DETAIL: (id) => `/api/stock/${id}/`,
    CREATE: "/api/stock/",
    UPDATE: (id) => `/api/stock/${id}/`,
    DELETE: (id) => `/api/stock/${id}/`,
  },

  // Reservations
  RESERVATIONS: {
    LIST: "/reservations",
    DETAIL: (id) => `/reservations/${id}`,
    CREATE: "/reservations",
    UPDATE: (id) => `/reservations/${id}`,
    DELETE: (id) => `/reservations/${id}`,
  },

  // Rents
  RENTS: {
    LIST: "/api/rents/", // supports ?unit=ID or ?tenant=ID
    DETAIL: (id) => `/api/rents/${id}/`,
    CREATE: "/api/rents/",
    UPDATE: (id) => `/api/rents/${id}/`,
    DELETE: (id) => `/api/rents/${id}/`,
  },

  // Contracts
  CONTRACTS: {
    LIST: "/contracts",
    DETAIL: (id) => `/contracts/${id}`,
    CREATE: "/contracts",
    UPDATE: (id) => `/contracts/${id}`,
    DELETE: (id) => `/contracts/${id}`,
  },

  // Leases
  LEASES: {
    LIST: "/leases",
    DETAIL: (id) => `/leases/${id}`,
    CREATE: "/leases",
    UPDATE: (id) => `/leases/${id}`,
    DELETE: (id) => `/leases/${id}`,
  },

  // Reviews
  REVIEWS: {
    LIST: "/api/tenants/reviews/",
    DETAIL: (id) => `/api/tenants/reviews/${id}/`,
    CREATE: "/api/tenants/reviews/",
    UPDATE: (id) => `/api/tenants/reviews/${id}/`,
    DELETE: (id) => `/api/tenants/reviews/${id}/`,
  },

  // Dashboard
  DASHBOARD: {
    HOME_METRICS: "/dashboard/home/metrics/",
    STOCK_METRICS: "/dashboard/stock/metrics/",
  },

  // Cities & Districts
  CITIES: {
    LIST: "/api/cities/",
    DETAIL: (id) => `/api/cities/${id}/`,
    CREATE: "/api/cities/",
    UPDATE: (id) => `/api/cities/${id}/`,
    DELETE: (id) => `/api/cities/${id}/`,
  },
  DISTRICTS: {
    LIST: "/api/districts/",
    DETAIL: (id) => `/api/districts/${id}/`,
    CREATE: "/api/districts/",
    UPDATE: (id) => `/api/districts/${id}/`,
    DELETE: (id) => `/api/districts/${id}/`,
  },

  // Reports
  REPORTS: {
    DASHBOARD: "/reports/dashboard",
    REVENUE: "/reports/revenue",
    OCCUPANCY: "/reports/occupancy",
    PAYMENTS: "/reports/payments",
  },

  // Calendar
  CALENDAR: {
    EVENTS: "/calendar/events",
    CREATE_EVENT: "/calendar/events",
    UPDATE_EVENT: (id) => `/calendar/events/${id}`,
    DELETE_EVENT: (id) => `/calendar/events/${id}`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: "/api/notifications/",
  },
};

export default API_ENDPOINTS;
