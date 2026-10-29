import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { Login } from "../store/slices/authSlice";

const EyeOpen = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeClosed = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.12-3.592M6.53 6.53A9.97 9.97 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.05 10.05 0 01-4.417 5.294M3 3l18 18" />
  </svg>
);

const ErrorIcon = () => (
  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 12 12" fill="currentColor">
    <path d="M6 0a6 6 0 100 12A6 6 0 006 0zm.75 9H5.25V7.5h1.5V9zm0-3H5.25V3h1.5v3z" />
  </svg>
);

// Lock icon for Sign In button
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

// Arrow icon for Sign In button
const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

// Email icon
const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

// Password icon
const KeyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

// Shield icon for badge
const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  const handleChangeInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!formData.email || !formData.password) return;
    const formdata = new FormData();
    formdata.append("email", formData.email);
    formdata.append("password", formData.password);
    dispatch(Login(formdata));
  };

  const errors = {
    email: touched.email && !formData.email ? "Email is required" : "",
    password: touched.password && !formData.password ? "Password is required" : "",
  };

  if (isAuthenticated && user?.role === "Admin") {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 py-10 relative overflow-hidden">

      {/* Animated background blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-700 opacity-20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-700 opacity-20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-800 opacity-10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Card */}
      <div className="relative w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl shadow-black/50">

        {/* Top accent line */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent rounded-full" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-3 py-1.5 mb-6">
          <ShieldIcon />
          <span className="text-indigo-300 text-xs font-semibold uppercase tracking-widest">Secure Admin Portal</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Welcome back 👋</h1>
        <p className="text-sm text-slate-500 mb-8">Enter your credentials to access the dashboard</p>

        <form onSubmit={handleLogin} noValidate className="space-y-5">

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-400 mb-2 tracking-widest uppercase">
              Email Address
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 pointer-events-none">
                <EmailIcon />
              </span>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                placeholder="you@example.com"
                onChange={handleChangeInput}
                onBlur={handleBlur}
                autoComplete="email"
                className={`w-full bg-white/5 border rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200
                  focus:bg-indigo-500/5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25
                  ${errors.email ? "border-red-500/70 ring-2 ring-red-500/20 bg-red-500/5" : "border-white/10 hover:border-white/20"}`}
              />
            </div>
            {errors.email && (
              <p className="flex items-center gap-1.5 mt-2 text-xs text-red-400">
                <ErrorIcon /> {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-slate-400 mb-2 tracking-widest uppercase">
              Password
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 pointer-events-none">
                <KeyIcon />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                placeholder="••••••••••••"
                onChange={handleChangeInput}
                onBlur={handleBlur}
                autoComplete="current-password"
                className={`w-full bg-white/5 border rounded-xl pl-10 pr-12 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200
                  focus:bg-indigo-500/5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25
                  ${errors.password ? "border-red-500/70 ring-2 ring-red-500/20 bg-red-500/5" : "border-white/10 hover:border-white/20"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 text-slate-500 hover:text-slate-300 transition-colors duration-200"
              >
                {showPassword ? <EyeOpen /> : <EyeClosed />}
              </button>
            </div>
            {errors.password && (
              <p className="flex items-center gap-1.5 mt-2 text-xs text-red-400">
                <ErrorIcon /> {errors.password}
              </p>
            )}
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 accent-indigo-500 cursor-pointer rounded"
              />
              <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors cursor-pointer">
                Remember me
              </span>
            </label>
            <Link
              to="/password/forgot"
              className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </div>

          {/* ✅ Enhanced Sign In Button with icons */}
          <button
            type="submit"
            disabled={loading}
            className="group w-full flex items-center justify-center gap-2.5
              bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600
              hover:from-indigo-500 hover:via-indigo-500 hover:to-purple-500
              disabled:opacity-50 disabled:cursor-not-allowed
              text-white font-semibold text-sm rounded-xl py-3.5 mt-1
              shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50
              transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95
              border border-indigo-500/30 hover:border-indigo-400/50"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin text-white/80" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <span>Signing in…</span>
              </>
            ) : (
              <>
                <LockIcon />
                <span>Sign In</span>
                <ArrowRightIcon />
              </>
            )}
          </button>

        </form>

        {/* Divider */}
        {/* <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-slate-600 px-1">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div> */}

        {/* Sign up link */}
        {/* <p className="text-center text-xs text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 transition-colors duration-200"
          >
            Create one →
          </Link>
        </p> */}

        {/* Security note
        <p className="flex items-center justify-center gap-1.5 mt-5 text-xs text-slate-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          256-bit SSL encrypted · Secured by Anthropic
        </p> */}

      </div>
    </div>
  );
};

export default LoginPage;