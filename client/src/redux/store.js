import { configureStore } from "@reduxjs/toolkit";
import userVenueSlice from './slices/UserVenueSlice'

import authSlice from "./slices/authSlice"
import UserProfileSlice from "./slices/UserProfileSlice";
import UserWishlistSlice from "./slices/UserWishlistSlice";
import adminUserSlice from './slices/AdminUserSlice'
import adminVendorSlice from './slices/AdminvendorSlice'





export const store = configureStore({
    reducer: {
        userVenue: userVenueSlice,
        adminUser: adminUserSlice,
        userProfile: UserProfileSlice,
        userWishlist: UserWishlistSlice,
        adminVendor: adminVendorSlice,
        auth: authSlice,
        userVenue: userVenueSlice
        

    }
})



