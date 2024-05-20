import { createSlice } from "@reduxjs/toolkit";
import { ToastType } from "../../utils/Types";

const initialState = {
  toasts: [ToastType],
};

export const meetingsSlice = createSlice({
  name: "meetings",
  initialState,
  reducers: {
    setToasts: (state, action) => {
      state.toasts = action.payload;
    },
  },
});

export const { setToasts } = meetingsSlice.actions;