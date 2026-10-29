import React, { useMemo, useState } from "react";
import {
  LayoutDashboard,
  ListOrdered,
  Package,
  Users,
  User,
  UserCheck,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Logout } from "../store/slices/authSlice";
import { toggleComponent, toggleNavbarOpen } from "../store/slices/extraSlice";
import DbToggle from "./DbToggle";

const SideBar = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { isNavbarOpened } = useSelector((state) => state.extra);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [activeLink, setActiveLink] = useState(0);

  const links = useMemo(
    () => [
      { icon: LayoutDashboard, title: "Dashboard", badge: null },
      // { icon: ListOrdered, title: "Orders", badge: orders?.length || null },
      // { icon: Package, title: "Products", badge: null },
      { icon: Users, title: "Users", badge: null },
      { icon: User, title: "Profile", badge: null },
      { title: "Vendor Requests", icon: UserCheck },
    ],
    [orders?.length],
  );

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const handleSelect = (index, title) => {
    setActiveLink(index);
    dispatch(toggleComponent(title));
  };

  const handleLogout = () => dispatch(Logout());

  const displayName = user?.name || "Admin";
  const displayEmail = user?.email || "";
  const initial = displayName.charAt(0).toUpperCase();

  // Shared tooltip shown only when the sidebar is collapsed
  const Tooltip = ({ children }) => (
    <span
      role="tooltip"
      className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2
        whitespace-nowrap rounded-md border border-white/10 bg-slate-800 px-2.5 py-1.5
        text-xs font-medium text-white opacity-0 shadow-xl
        transition-opacity duration-150
        group-hover:opacity-100 group-focus-visible:opacity-100"
    >
      {children}
    </span>
  );

  return (
    <aside
      aria-label="Main navigation"
      className={`fixed bottom-3 left-3 top-3 z-40 flex flex-col rounded-2xl
        border border-white/5 bg-slate-950 shadow-2xl
        transition-[width] duration-300 ease-in-out
        ${isNavbarOpened ? "w-60" : "w-[72px]"}`}
    >
      {/* Brand */}
      <div
        className={`flex h-16 flex-shrink-0 items-center gap-3 border-b border-white/5
          ${isNavbarOpened ? "px-4" : "justify-center"}`}
      >
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-600">
          <LayoutDashboard size={18} className="text-white" aria-hidden="true" />
        </div>
        {isNavbarOpened && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">Admin Panel</p>
            <p className="truncate text-xs text-slate-500">Store management</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-visible px-3 py-4">
        {links.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeLink === index;

          return (
            <button
              key={item.title}
              type="button"
              onClick={() => handleSelect(index, item.title)}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.title}
              className={`group relative flex w-full items-center gap-3 rounded-lg py-2.5
                transition-colors duration-150
                focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400
                ${isNavbarOpened ? "px-3" : "justify-center"}
                ${
                  isActive
                    ? "bg-indigo-600/15 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                }`}
            >
              {/* Active indicator */}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute -left-3 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-indigo-500"
                />
              )}

              <Icon
                size={18}
                strokeWidth={isActive ? 2.25 : 1.75}
                className={`flex-shrink-0 ${isActive ? "text-indigo-400" : ""}`}
                aria-hidden="true"
              />

              {isNavbarOpened && (
                <span className="flex-1 truncate text-left text-sm font-medium">
                  {item.title}
                </span>
              )}

              {/* Badge: pill when open, dot when collapsed */}
              {item.badge &&
                (isNavbarOpened ? (
                  <span className="min-w-[22px] flex-shrink-0 rounded-full bg-indigo-500 px-1.5 py-0.5 text-center text-xs font-semibold text-white">
                    {item.badge}
                  </span>
                ) : (
                  <span
                    aria-hidden="true"
                    className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-indigo-400 ring-2 ring-slate-950"
                  />
                ))}

              {!isNavbarOpened && (
                <Tooltip>
                  {item.title}
                  {item.badge ? ` (${item.badge})` : ""}
                </Tooltip>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      {/* Footer */}
<div className="flex-shrink-0 space-y-1 border-t border-white/5 p-3">
  {/* Database toggle (Local / Live) */}
  <div
    className={`rounded-lg bg-white/[0.03] p-2 ${
      isNavbarOpened ? "" : "flex justify-center"
    }`}
  >
    <DbToggle />
  </div>
</div>
      <div className="flex-shrink-0 space-y-1 border-t border-white/5 p-3">
        {/* Collapse toggle */}
        <button
          type="button"
          onClick={() => dispatch(toggleNavbarOpen())}
          aria-label={isNavbarOpened ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={isNavbarOpened}
          className={`group relative flex w-full items-center gap-3 rounded-lg py-2.5
            text-slate-500 transition-colors duration-150 hover:bg-white/5 hover:text-slate-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400
            ${isNavbarOpened ? "px-3" : "justify-center"}`}
        >
          {isNavbarOpened ? (
            <>
              <PanelLeftClose size={18} strokeWidth={1.75} aria-hidden="true" />
              <span className="text-sm font-medium">Collapse</span>
            </>
          ) : (
            <>
              <PanelLeftOpen size={18} strokeWidth={1.75} aria-hidden="true" />
              <Tooltip>Expand sidebar</Tooltip>
            </>
          )}
        </button>

        {/* Account + logout */}
        <div
          className={`flex items-center gap-3 rounded-lg bg-white/[0.03] p-2
            ${isNavbarOpened ? "" : "flex-col"}`}
        >
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold text-white"
            aria-hidden="true"
          >
            {initial}
          </div>

          {isNavbarOpened && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-100">{displayName}</p>
              {displayEmail && (
                <p className="truncate text-xs text-slate-500">{displayEmail}</p>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            className="group relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md
              text-slate-400 transition-colors duration-150 hover:bg-red-500/15 hover:text-red-400
              focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <LogOut size={16} strokeWidth={1.75} aria-hidden="true" />
            {!isNavbarOpened && <Tooltip>Log out</Tooltip>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;