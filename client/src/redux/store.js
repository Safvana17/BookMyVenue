import { configureStore } from "@reduxjs/toolkit";
import userVenueSlice from './slices/UserVenueSlice'
import authReducer from "./slices/authSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        userVenue: userVenueSlice
    }
})
