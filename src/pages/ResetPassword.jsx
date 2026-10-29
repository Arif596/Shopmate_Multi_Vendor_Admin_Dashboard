import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import {ResetPassword} from '../store/slices/authSlice'
const ResetPasswordComp = () => {
  const { user, isAuthenticated,loading } = useSelector((state) => state.auth);
  const {token}=useParams()
  const [formdata, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const handleChangeInput=(e)=>{
  e.preventDefault();
  setFormData({...formdata,[e.target.name]:e.target.value})
  }
  const dispatch=useDispatch();
  const handleSubmit=(e)=>{
    e.preventDefault();
    const data=new FormData();
    data.append("password",formdata.password);
    data.append("confirmPassword",formdata.confirmPassword);
    dispatch(ResetPassword(data,token))
  }
   if (isAuthenticated && user.role === "Admin") {
    return <Navigate to="/" />;
  }
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-200 px-4">
        <div className="bg-white shadow-lg rounded-2xl max-w-md w-full p-8 sm:p-10">
          <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
            Reset Password
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="p-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                name="password"
                value={formdata.password}
                placeholder="Enter Your new Password..."
                onChange={handleChangeInput}
                className="w-full px-4 py-3 border border-gray-300 rounded-md"
              />
            </div>
            <div className="p-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formdata.confirmPassword}
                placeholder="Enter Your Confirm Password"
                onChange={handleChangeInput}
                className="w-full px-4 py-3 border border-gray-300 rounded-md"
              />
            </div>
           
            <div className="px-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2  bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition py-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin">
                      <span>Reseting Password....</span>
                    </div>
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordComp;
