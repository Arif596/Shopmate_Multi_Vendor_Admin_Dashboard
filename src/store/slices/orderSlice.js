import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
export const FetchAllOrders = createAsyncThunk(
  "order/fetchAllOrder",
  async (_, thunkApi) => {
    try {
      const { data } = await axiosInstance.get("/order/get-AllOrder");
      return data.orderStatus;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to Fetch Orders",
      );
    }
  },
);
export const UpdateOrdersStatus = createAsyncThunk(
  "order/UpdateOrdersStatus",
  async ({ orderId, status }, thunkApi) => {
    try {
      const { data } = await axiosInstance.put(
        `/order/admin/update-order/${orderId}`,
        { status },
      );
      toast.success(data.message || "Order Status Updated successfully");
      return data.orderUpdateStatus;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to Updated Orders Status ",
      );
    }
  },
);
export const Deleteorder = createAsyncThunk(
  "order/Deleteorder",
  async (orderId, thunkApi) => {
    try {
      const { data } = await axiosInstance.delete(
        `/order/admin/delete-order/${orderId}`,
      );
      toast.success(data.message || "Order  Delete successfully");
      return orderId;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to Update Order");
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to Update Orders",
      );
    }
  },
);
const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    orders: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(FetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(FetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(FetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(UpdateOrdersStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(UpdateOrdersStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(
          (order) => order.id === action.payload.id,
        );
        if (index !== -1) {
          state.orders[index] = {
            ...state.orders[index],
            ...action.payload,
          };
        }
      })
      .addCase(UpdateOrdersStatus.rejected, (state) => {
        state.loading = false;
      })
      .addCase(Deleteorder.pending, (state) => {
        state.loading = true;
      })
      .addCase(Deleteorder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(
          (order) => order.id !== action.payload,
        );
      })
      .addCase(Deleteorder.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default orderSlice.reducer;
