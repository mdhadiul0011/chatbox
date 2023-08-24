import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slice/UsersSlice";
import activeSlice from '../slice/activeSingleSlice'
import activeSingleSlice from "../slice/activeSingleSlice";

const store = configureStore({
    reducer: {
        loggedinSlice: authSlice,
        active: activeSlice,
    }
});

export default store;
