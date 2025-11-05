import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import unitsReducer from "./slices/unitsSlice";
import tenantsReducer from "./slices/tenantsSlice";
import ownersReducer from "./slices/ownersSlice";
import paymentsReducer from "./slices/paymentsSlice";
import stockReducer from "./slices/stockSlice";
import reservationsReducer from "./slices/reservationsSlice";
import contractsReducer from "./slices/contractsSlice";
import leasesReducer from "./slices/leasesSlice";
import reviewsReducer from "./slices/reviewsSlice";
import reportsReducer from "./slices/reportsSlice";
import calendarReducer from "./slices/calendarSlice";
import dashboardReducer from "./slices/dashboardSlice";
import citiesReducer from "./slices/citiesSlice";
import notificationsReducer from "./slices/notificationsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    units: unitsReducer,
    tenants: tenantsReducer,
    owners: ownersReducer,
    payments: paymentsReducer,
    stock: stockReducer,
    reservations: reservationsReducer,
    contracts: contractsReducer,
    leases: leasesReducer,
    reviews: reviewsReducer,
    reports: reportsReducer,
    calendar: calendarReducer,
    dashboard: dashboardReducer,
    cities: citiesReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Type definitions (for TypeScript projects)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
