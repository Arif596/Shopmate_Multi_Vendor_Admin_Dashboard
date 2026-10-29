import React, { useState } from "react";
import defaultAvatar from "../assets/avatar.jpg";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import {
  UpdateAdminPassword,
  UpdateAdminProfile,
} from "../store/slices/authSlice";

const EyeIcon = ({ open }) =>
  open ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

const PasswordField = ({ label, name, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 pr-11 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition"
        >
          <EyeIcon open={show} />
        </button>
      </div>
    </div>
  );
};

const Profile = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("profile");
  const [editData, setEditData] = useState({ name: user?.name || "", email: user?.email || "" });
  const [passwordData, setPasswordData] = useState({
    cuurentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleChangeAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };
  const handleChangeProfile = (e) => setEditData({ ...editData, [e.target.name]: e.target.value });
  const handleChangePassword = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const updateProfile = () => {
    const formData = new FormData();
    formData.append("name", editData.name);
    formData.append("email", editData.email);
    if (avatarFile) formData.append("avatar", avatarFile);
    dispatch(UpdateAdminProfile(formData));
  };

  const updatePassword = () => {
    const formData = new FormData();
    formData.append("cuurentPassword", passwordData.cuurentPassword);
    formData.append("newPassword", passwordData.newPassword);
    formData.append("confirmNewPassword", passwordData.confirmNewPassword);
    dispatch(UpdateAdminPassword(formData));
  };

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "A";

  const getPasswordStrength = (pass) => {
    if (!pass) return null;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    const levels = [
      { label: "Weak", bars: 1, barColor: "bg-red-500", textColor: "text-red-500" },
      { label: "Fair", bars: 2, barColor: "bg-amber-400", textColor: "text-amber-500" },
      { label: "Good", bars: 3, barColor: "bg-blue-500", textColor: "text-blue-500" },
      { label: "Strong", bars: 4, barColor: "bg-emerald-500", textColor: "text-emerald-500" },
    ];
    return levels[Math.max(score - 1, 0)];
  };

  const pwStrength = getPasswordStrength(passwordData.newPassword);
  const passwordsMatch =
    passwordData.confirmNewPassword && passwordData.confirmNewPassword === passwordData.newPassword;
  const passwordsMismatch =
    passwordData.confirmNewPassword && passwordData.confirmNewPassword !== passwordData.newPassword;

  return (
    <main className="min-h-screen bg-slate-50 pl-0  w-full ms-4">
      <div className=" px-4 sm:px-6 py-8">

        <Header />
        <p className="text-xs text-slate-400 mb-6 mt-1">Manage your account settings</p>

        {/* ── Hero Card ── */}
        <div className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 overflow-hidden shadow-xl">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-56 h-56 bg-indigo-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-36 h-36 bg-violet-400 opacity-10 rounded-full translate-y-1/2 pointer-events-none" />

          {/* Avatar */}
          <div className="relative shrink-0 z-10">
            <div className="w-24 h-24 rounded-full ring-4 ring-indigo-400/40 ring-offset-2 ring-offset-indigo-900 overflow-hidden bg-indigo-700 flex items-center justify-center shadow-lg">
              {avatarPreview || user?.avatar?.url ? (
                <img
                  src={avatarPreview || user?.avatar?.url}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-indigo-200">
                  {getInitials(user?.name)}
                </span>
              )}
            </div>
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 border-2 border-indigo-900 rounded-full" />
          </div>

          {/* Info */}
          <div className="text-center sm:text-left z-10">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {user?.name || "Admin"}
            </h2>
            <p className="text-indigo-300 text-sm font-mono mt-1">{user?.email}</p>
            <span className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {user?.role || "Admin"}
            </span>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-slate-200/80 p-1 rounded-xl w-fit mb-6">
          {[
            { key: "profile", label: "Edit Profile" },
            { key: "password", label: "Security" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Profile Tab ── */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Profile Information</h3>
                <p className="text-xs text-slate-400">Update your name, email and photo</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleChangeProfile}
                  placeholder="Your name"
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleChangeProfile}
                  placeholder="you@example.com"
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>

              {/* Avatar Upload */}
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  Profile Photo
                </label>
                <label className="flex items-center gap-4 px-4 py-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition group">
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={handleChangeAvatar}
                    className="hidden"
                  />
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-200 shrink-0"
                      alt="preview"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition">
                      {avatarPreview ? "Photo selected — click to change" : "Click to upload photo"}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">PNG, JPG up to 5MB</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="h-px bg-slate-100 my-5" />

            <button
              onClick={updateProfile}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        )}

        {/* ── Password Tab ── */}
        {activeTab === "password" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Change Password</h3>
                <p className="text-xs text-slate-400">Use a strong password you don't use elsewhere</p>
              </div>
            </div>

            <div className="flex flex-col gap-5 mb-4">
              <PasswordField
                label="Current Password"
                name="cuurentPassword"
                value={passwordData.cuurentPassword}
                onChange={handleChangePassword}
                placeholder="Enter current password"
              />

              <div className="h-px bg-slate-100" />

              {/* New password + strength */}
              <div className="flex flex-col gap-1.5">
                <PasswordField
                  label="New Password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handleChangePassword}
                  placeholder="Enter new password"
                />
                {pwStrength && (
                  <div className="mt-1.5">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            i <= pwStrength.bars ? pwStrength.barColor : "bg-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-xs font-semibold ${pwStrength.textColor}`}>
                      {pwStrength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm password + match */}
              <div className="flex flex-col gap-1.5">
                <div className={`rounded-xl transition-all ${
                  passwordsMatch ? "ring-2 ring-emerald-300" : passwordsMismatch ? "ring-2 ring-red-300" : ""
                }`}>
                  <PasswordField
                    label="Confirm New Password"
                    name="confirmNewPassword"
                    value={passwordData.confirmNewPassword}
                    onChange={handleChangePassword}
                    placeholder="Confirm new password"
                  />
                </div>
                {passwordsMatch && (
                  <p className="text-xs font-semibold text-emerald-500">✓ Passwords match</p>
                )}
                {passwordsMismatch && (
                  <p className="text-xs font-semibold text-red-500">✗ Passwords don't match</p>
                )}
              </div>
            </div>

            <div className="h-px bg-slate-100 my-5" />

            <button
              onClick={updatePassword}
              disabled={loading || !!passwordsMismatch || !passwordData.newPassword}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        )}

      </div>
    </main>
  );
};

export default Profile;
