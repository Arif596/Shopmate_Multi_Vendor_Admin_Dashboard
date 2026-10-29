import { createSlice } from "@reduxjs/toolkit";

const extraSlice = createSlice({
  name: "extra",
  initialState: {
    openedComponent: "Dashboard",
    isNavbarOpened: true,
    isViewProductModalOpened: false,
    isCreateProductModalOpened: false,
    isUpdateProductModalOpened: false,
  },
  reducers: {
    toggleComponent: (state, action) => {
      state.openedComponent = action.payload;
    },
    toggleNavbarOpen: (state) => {
      state.isNavbarOpened = !state.isNavbarOpened;
    },
    toggleViewProductModalOpened: (state) => {
      state.isViewProductModalOpened = !state.isViewProductModalOpened;
    },
    toggleCreateProductModalOpened: (state) => {
      state.isCreateProductModalOpened = !state.isCreateProductModalOpened;
    },
    toggleUpdateProductModalOpened: (state) => {
      state.isUpdateProductModalOpened = !state.isUpdateProductModalOpened;
    },
  },
});

export const {
  toggleComponent,
  toggleCreateProductModalOpened,
  toggleUpdateProductModalOpened,
  toggleViewProductModalOpened,
  toggleNavbarOpen,
} = extraSlice.actions;

export default extraSlice.reducer;
