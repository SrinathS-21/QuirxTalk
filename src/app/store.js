import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices/AuthSlice"; 
import { meetingsSlice } from "./slices/MeetingSlice";

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        meetings:meetingsSlice.reducer,
    },
});

const RootState = store.getState();
const AppDispatch = store.dispatch;

export { store, RootState, AppDispatch };
