import { createSlice } from "@reduxjs/toolkit";

export const activeSingleSlice = createSlice ({
    name: 'Single',
    initialState: {
        active: localStorage.getItem('activeSingle') ? JSON.parse(localStorage.getItem('activeSingle')) : null ,
    },
    reducers: {
        activeSingle: (state,action) => {
            state.active = action.payload;
        },
    },
});

export const {activeSingle} = activeSingleSlice.actions;

export default activeSingleSlice.reducer;