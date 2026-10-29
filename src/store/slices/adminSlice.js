import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const adminSlice = createSlice({
  name: "admin",
  initialState: {
    loading: false,
    totalUsers: 0,
    users: [],
    totalRevinueAllTime: 0,
    todayRevinueResult: 0,
    yesterdayRevinueResult: 0,
    totaluserCount: 0,
    MonthlySale: [],
    orderStatusCounts: {},
    topProducts: [],
    lowStockProducts: 0,
    revenueGrowth: "",
    newUserThisMonth: 0,
    currentMonthSale: 0,
  },
  reducers: {
    getAllUserRequest(state) {
      state.loading = true;
    },

    getAllUserSuccess(state, action) {
      state.loading = false;
      state.users = action.payload.users;
      state.totalUsers = action.payload.totalUsers;
    },
    getAllUserFailed(state) {
      state.loading = false;
    },
    DeleteUserRequest(state) {
      state.loading = true;
    },
    DeleteUserSuccess(state, action) {
      state.loading = false;
      state.users = state.users.filter((user) => user.id !== action.payload);
      state.totalUsers = Math.max(0, state.totalUsers - 1);
      state.totaluserCount = Math.max(0, state.totaluserCount - 1);
    },
    DeleteUserFailed(state) {
      state.loading = false;
    },
    getStatsRequest(state) {
      state.loading = true;
    },
    getStatsSuccess(state, action) {
      state.loading = false;
      state.totalRevinueAllTime = action.payload.totalRevinueAllTime;
      state.todayRevinueResult = action.payload.todayRevinueResult;
      state.yesterdayRevinueResult = action.payload.yesterdayRevinueResult;
      state.totaluserCount = action.payload.totaluserCount;
      state.MonthlySale = action.payload.MonthlySale;
      state.topProducts = action.payload.topProducts;
      state.lowStockProducts = action.payload.lowStockProducts?.length;
      state.revenueGrowth = action.payload.revenueGrowth;
      state.newUserThisMonth = action.payload.newUserThisMonth;
      state.currentMonthSale = action.payload.currentMonthSale;
      state.orderStatusCounts = action.payload.orderStatusCounts || {};
    },
    getStatsFailed(state) {
      state.loading = false;
    },
        makeVendorRequest(state) {
      state.loading = true;
    },
    makeVendorSuccess(state, action) {
      state.loading = false;
      // vendor ban gaya, ab user list se hata do (list sirf role=User dikhati hai)
      state.users = state.users.filter((user) => user.id !== action.payload);
      state.totalUsers = Math.max(0, state.totalUsers - 1);
      state.totaluserCount = Math.max(0, state.totaluserCount - 1);
    },
    makeVendorFailed(state) {
      state.loading = false;
    },
        updateUserRequest(state) {
      state.loading = true;
    },
    updateUserSuccess(state, action) {
      state.loading = false;
      const updated = action.payload;
      state.users = state.users.map((u) =>
        u.id === updated.id ? { ...u, ...updated } : u,
      );
    },
    updateUserFailed(state) {
      state.loading = false;
    },
  },
});

export const fetchAllUsers = (page) => async (dispatch) => {
  dispatch(adminSlice.actions.getAllUserRequest());
  try {
    const res = await axiosInstance.get(
      `/admin/get-all-users?page=${page || 1}`,
    );
    dispatch(adminSlice.actions.getAllUserSuccess(res.data));
  } catch (error) {
    dispatch(adminSlice.actions.getAllUserFailed());
    toast.error(error?.response?.data?.message || "Failed to Fetch Users");
  }
};

export const DeleteUser = (userId, page) => async (dispatch, getState) => {
  dispatch(adminSlice.actions.DeleteUserRequest());
  try {
    const res = await axiosInstance.delete(`/admin/delete-users/${userId}`);
    dispatch(adminSlice.actions.DeleteUserSuccess(userId));
    toast.success(res.data?.message || "User Deleted Successfully");

    const state = getState();
    const updatedTotal = state.admin.totalUsers;
    const updatedMaxPage = Math.ceil(updatedTotal / 10) || 1;
    const validPage = Math.min(page, updatedMaxPage);
    dispatch(fetchAllUsers(validPage));
  } catch (error) {
    dispatch(adminSlice.actions.DeleteUserFailed());
    toast.error(error.response?.data?.message || "Failed to Delete User");
  }
};

export const fetchDashboardStates = () => async (dispatch) => {
  dispatch(adminSlice.actions.getStatsRequest());
  try {
    const res = await axiosInstance.get("/admin/get/dashboard-stats");
    console.log("Dashboard State", res);
    dispatch(adminSlice.actions.getStatsSuccess(res.data));
  } catch (error) {
    dispatch(adminSlice.actions.getStatsFailed());
    toast.error(error.response?.data?.message || "Failed to fetch stats");
  }
};

export const makeVendor = (userId, page) => async (dispatch, getState) => {
  dispatch(adminSlice.actions.makeVendorRequest());
  try {
    const res = await axiosInstance.patch(`/admin/users/${userId}/make-vendor`);
    dispatch(adminSlice.actions.makeVendorSuccess(userId));
    toast.success(res.data?.message || "User promoted to Vendor");

    const state = getState();
    const updatedMaxPage = Math.ceil(state.admin.totalUsers / 10) || 1;
    const validPage = Math.min(page || 1, updatedMaxPage);
    dispatch(fetchAllUsers(validPage));
  } catch (error) {
    dispatch(adminSlice.actions.makeVendorFailed());
  toast.error(error.response?.data?.message || error.message || "Failed to make vendor");
  }
};
export const updateUser = (userId, values, page) => async (dispatch) => {
  dispatch(adminSlice.actions.updateUserRequest());
  try {
    const res = await axiosInstance.put(`/admin/users/${userId}`, values);
    dispatch(adminSlice.actions.updateUserSuccess(res.data.user));
    toast.success(res.data?.message || "User updated successfully");
    dispatch(fetchAllUsers(page || 1));
  } catch (error) {
    dispatch(adminSlice.actions.updateUserFailed());
    toast.error(error.response?.data?.message || "Failed to update user");
  }
};

export default adminSlice.reducer;
