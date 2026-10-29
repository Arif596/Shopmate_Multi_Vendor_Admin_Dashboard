import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { ForgotPassword } from "../store/slices/authSlice";
const ForgotPasswordComp = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(ForgotPassword({ email }));
    setEmail("");
  };
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  if (isAuthenticated && user.role === "Admin") {
    return <Navigate to="/" />;
  }
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-200 px-4">
        <div className="bg-white shadow-lg rounded-2xl max-w-md w-full p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Forgot Password
          </h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="p-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Enter Your Email
              </label>
              <input
                type="text"
                name="email"
                value={email}
                placeholder="example@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-500 rounded-md"
              />
            </div>
            <div className="px-2 flex justify-end items-center text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <label htmlFor="remeber">Remember Password</label>
              </div>
              <Link
                to={"/login"}
                type="button"
                className="text-blue-600 hover:underline"
              >
                Remember Password?
              </Link>
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
                      <span>Requesting For Email....</span>
                    </div>
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordComp;
