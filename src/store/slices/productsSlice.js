import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import {
  toggleCreateProductModalOpened,
  toggleUpdateProductModalOpened,
} from "./extraSlice";

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    fetchingProduct: false,
    product: [],
    totalProduct: 0,
  },
  reducers: {
    createProductRequest(state) {
      state.loading = true;
    },
    createProductSuccess(state, action) {
      state.loading = false;
      state.product = [action.payload, ...state.product];
    },
    createProductFailed(state) {
      state.loading = false;
    },
    getAllProductRequest(state) {
      state.fetchingProduct = true;
    },
    getAllProductSuccess(state, action) {
      state.fetchingProduct = false;
      state.product = action.payload.product;
      state.totalProduct = action.payload.totalProduct;
    },
    getAllProductFailed(state) {
      state.fetchingProduct = false;
    },
    UpdateAllProductRequest(state) {
      state.loading = true;
    },
    UpdateAllProductSuccess(state, action) {
      state.loading = false;
      state.product = state.product.map((product) =>
        product.id === action.payload.id ? action.payload : product,
      );
    },
    UpdateAllProductFailed(state) {
      state.loading = false;
    },
    DeleteAllProductRequest(state) {
      state.loading = true;
    },
    DeleteAllProductSuccess(state, action) {
      state.loading = false;
      state.product = state.product.filter(
        (product) => product.id !== action.payload,
      );
      state.totalProduct = Math.max(0, state.totalProduct - 1);
    },
    DeleteAllProductFailed(state) {
      state.loading = false;
    },
  },
});

export const createNewProduct = (data) => async (dispatch) => {
  dispatch(productSlice.actions.createProductRequest());
  try {
    const res = await axiosInstance.post("/product/admin/create", data);
    dispatch(productSlice.actions.createProductSuccess(res.data.product));
    toast.success(res.data.message || "Product Created Successfully");
    console.log("All Product Response", res);
    dispatch(toggleCreateProductModalOpened());
  } catch (error) {
    dispatch(productSlice.actions.createProductFailed());
    toast.error(error?.response?.data?.message || "Failed to create Product");
  }
};
export const FetchAllproduct = (page) => async (dispatch) => {
  dispatch(productSlice.actions.getAllProductRequest());
  try {
    const res = await axiosInstance.get(
      `/product/all-product?page=${page || 1}`,
    );
    dispatch(productSlice.actions.getAllProductSuccess(res.data));
    console.log("Fetch All Product", res);
  } catch (error) {
    dispatch(productSlice.actions.getAllProductFailed());
  }
};
export const UpdateNewProduct = (data, id) => async (dispatch) => {
  dispatch(productSlice.actions.UpdateAllProductRequest());
  try {
    const res = await axiosInstance.put(
      `/product/admin/update-product/${id}`,
      data,
    );
    console.log("update Response", res);
    dispatch(productSlice.actions.UpdateAllProductSuccess(res.data.product));
    toast.success(res.data.message || "Product Updated Successfully");
    console.log("All Product Response", res);
    dispatch(toggleUpdateProductModalOpened());
  } catch (error) {
    dispatch(productSlice.actions.UpdateAllProductFailed());
    toast.error(error?.response?.data?.message || "Failed to Update Product");
  }
};
export const DeleteNewProduct = (id, page) => async (dispatch, getState) => {
  dispatch(productSlice.actions.DeleteAllProductRequest());
  try {
    const res = await axiosInstance.delete(
      `/product/admin/delete-product/${id}`,
    );
    dispatch(productSlice.actions.DeleteAllProductSuccess(id));
    toast.success(res.data.message || "Product Deleted Successfully");
    console.log("All Product Response", res);
    dispatch(toggleCreateProductModalOpened());
    const state = getState();
    const updatedtotal = state.product.totalProducts;
    const updatedMaxPage = Math.ceil(updatedtotal / 10 || 1);
    const validPage = Math.min(page, updatedMaxPage);
    dispatch(FetchAllproduct(validPage));
  } catch (error) {
    dispatch(productSlice.actions.DeleteAllProductFailed());
    toast.error(error?.response?.data?.message || "Failed to delete Product");
  }
};
export default productSlice.reducer;
