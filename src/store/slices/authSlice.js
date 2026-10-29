import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { axiosInstance } from "../../lib/axios";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: true, // sirf app start (GetUser) ke liye
    authLoading: false, // login / logout / update actions ke liye
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    // Login
    LoginRequest: (state) => {
      state.authLoading = true;
    },
    LoginSuccess: (state, action) => {
      state.authLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    LoginFailed: (state) => {
      state.authLoading = false;
    },

    // Get user (app start / refresh)
    GetUserRequest: (state) => {
      state.loading = true;
    },
    GetUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    GetUserFailed: (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    },

    // Logout
    LogoutRequest: (state) => {
      state.authLoading = true;
    },
    LogoutSuccess: (state) => {
      state.authLoading = false;
      state.user = null;
      state.isAuthenticated = false;
    },
    LogoutFailed: (state) => {
      state.authLoading = false;
    },

    // Forgot password
    ForgotPasswordRequest: (state) => {
      state.authLoading = true;
    },
    ForgotPasswordSuccess: (state) => {
      state.authLoading = false;
    },
    ForgotPasswordFailed: (state) => {
      state.authLoading = false;
    },

    // Reset password
    ResetPasswordRequest: (state) => {
      state.authLoading = true;
    },
    ResetPasswordSuccess: (state, action) => {
      state.authLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    ResetPasswordFailed: (state) => {
      state.authLoading = false;
    },

    // Update profile
    UpdateProfileRequest: (state) => {
      state.authLoading = true;
    },
    UpdateProfileSuccess: (state, action) => {
      state.authLoading = false;
      state.user = action.payload;
    },
    UpdateProfileFailed: (state) => {
      state.authLoading = false;
    },

    // Update password
    UpdatePasswordRequest: (state) => {
      state.authLoading = true;
    },
    UpdatePasswordSuccess: (state) => {
      state.authLoading = false;
    },
    UpdatePasswordFailed: (state) => {
      state.authLoading = false;
    },

    resetAuthSlice: (state) => {
      state.authLoading = false;
    },
  },
});

export const Login = (data) => async (dispatch) => {
  dispatch(authSlice.actions.LoginRequest());
  try {
    const res = await axiosInstance.post("/auth/login", data);
    if (res.data?.user?.role === "Admin") {
      dispatch(authSlice.actions.LoginSuccess(res.data?.user));
      toast.success(res.data?.message);
    } else {
      dispatch(authSlice.actions.LoginFailed());
      toast.error(res.data?.message || "Access denied! Admin only");
    }
  } catch (error) {
    dispatch(authSlice.actions.LoginFailed());
    toast.error(error.response?.data?.message || "Login Failed");
  }
};

export const GetUser = () => async (dispatch) => {
  dispatch(authSlice.actions.GetUserRequest());
  try {
    const res = await axiosInstance.get("/auth/get-user");
    dispatch(authSlice.actions.GetUserSuccess(res.data.user));
  } catch (error) {
    dispatch(authSlice.actions.GetUserFailed());
  }
};

export const Logout = () => async (dispatch) => {
  dispatch(authSlice.actions.LogoutRequest());
  try {
    const res = await axiosInstance.get("/auth/logout");
    dispatch(authSlice.actions.LogoutSuccess());
    toast.success(res.data?.message);
  } catch (error) {
    dispatch(authSlice.actions.LogoutFailed());
    toast.error(error.response?.data?.message || "Logout Failed");
  }
};

export const ForgotPassword = (email) => async (dispatch) => {
  dispatch(authSlice.actions.ForgotPasswordRequest());
  try {
    const res = await axiosInstance.post(`/auth/password/reset`, { email });
    dispatch(authSlice.actions.ForgotPasswordSuccess());
    toast.success(res.data.message);
  } catch (error) {
    dispatch(authSlice.actions.ForgotPasswordFailed());
    toast.error(
      error.response?.data?.message || "Cannot Access For Reset Password",
    );
  }
};

export const ResetPassword = (newData, token) => async (dispatch) => {
  dispatch(authSlice.actions.ResetPasswordRequest());
  try {
    const res = await axiosInstance.put(
      `/auth/password/reset/${token}`,
      newData,
    );
    dispatch(authSlice.actions.ResetPasswordSuccess(res.data?.user));
    toast.success(res.data?.message);
  } catch (error) {
    dispatch(authSlice.actions.ResetPasswordFailed());
    toast.error(error.response?.data?.message || "Failed to Reset Password");
  }
};

export const UpdateAdminProfile = (data) => async (dispatch) => {
  dispatch(authSlice.actions.UpdateProfileRequest());
  try {
    const res = await axiosInstance.put("/auth/profile/update", data);
    dispatch(authSlice.actions.UpdateProfileSuccess(res.data?.user));
    toast.success(res.data?.message);
  } catch (error) {
    dispatch(authSlice.actions.UpdateProfileFailed());
    toast.error(error.response?.data?.message || "Failed to Update Profile");
  }
};

export const UpdateAdminPassword = (data) => async (dispatch) => {
  dispatch(authSlice.actions.UpdatePasswordRequest());
  try {
    const res = await axiosInstance.put("/auth/password/update", data);
    dispatch(authSlice.actions.UpdatePasswordSuccess());
    toast.success(res.data?.message);
  } catch (error) {
    dispatch(authSlice.actions.UpdatePasswordFailed());
    toast.error(error.response?.data?.message || "Failed to Update Password");
  }
};

export const resetAuthSlice = () => (dispatch) => {
  dispatch(authSlice.actions.resetAuthSlice());
};

export default authSlice.reducer;