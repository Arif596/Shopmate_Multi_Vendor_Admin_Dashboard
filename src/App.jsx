import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SideBar from "./components/SideBar";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "./components/Dashboard";
import Orders from "./components/Orders";
import Users from "./components/Users";
import Profile from "./components/Profile";
import Products from "./components/Products";
import LoginPage from "./pages/Login";
import ForgotPasswordComp from "./pages/ForgotPassword";
import ResetPasswordComp from "./pages/ResetPassword";
import { useEffect, useState } from "react";
import { GetUser } from "./store/slices/authSlice";
import { fetchAllUsers, fetchDashboardStates } from "./store/slices/adminSlice";
import { FetchAllproduct } from "./store/slices/productsSlice";
import VendorRequests from "./components/VendorRequests";
import PageLoader from "./components/PageLoader";

function App() {
  const dispatch = useDispatch();
  const { isNavbarOpened } = useSelector((state) => state.extra);
  const { openedComponent } = useSelector((state) => state.extra);
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const MIN_LOADER_MS = 5000; // loader kam az kam kitni der dikhe (milliseconds)
  useEffect(() => {
    dispatch(GetUser());
  }, []);
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchDashboardStates());
      dispatch(FetchAllproduct());
    }
  }, [isAuthenticated]);
  const [minLoaderDone, setMinLoaderDone] = useState(false);

useEffect(() => {
  const timer = setTimeout(() => setMinLoaderDone(true), MIN_LOADER_MS);
  return () => clearTimeout(timer);
}, []);
  const renderDashboardContent = () => {
    switch (openedComponent) {
      case "Dashboard":
        return <Dashboard />;
      case "Orders":
        return <Orders />;
      case "Users":
        return <Users />;
      case "Vendor Requests":
        return <VendorRequests />;
      case "Profile":
        return <Profile />;
      case "Products":
        return <Products />;
      default:
        return <Dashboard />;
    }
  };
if (loading || !minLoaderDone) {
  return <PageLoader />;
}
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/password/forgot" element={<ForgotPasswordComp />} />
        <Route path="/password/reset/:token" element={<ResetPasswordComp />} />

        {/* Protected Admin Route */}
        <Route
          path="/"
          element={
            isAuthenticated && user?.role === "Admin" ? (
              <div className="flex min-h-screen">
                <SideBar />
                <main
                  className="flex-1 overflow-auto transition-all duration-300"
                  style={{ marginLeft: isNavbarOpened ? 256 : 64 }}
                >
                  {renderDashboardContent()}
                </main>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
      <ToastContainer theme="dark" />
    </Router>
  );
}

export default App;
