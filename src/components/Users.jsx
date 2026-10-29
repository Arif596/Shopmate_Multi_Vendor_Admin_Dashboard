// import React, { useEffect, useState } from "react";
// import avatar from "../assets/avatar.jpg";
// import { useDispatch, useSelector } from "react-redux";
// import Header from "./Header";
// import { DeleteUser, fetchAllUsers } from "../store/slices/adminSlice";

// const Users = () => {
//   const [page, setPage] = useState(1);
//   const { loading, users, totalUsers } = useSelector((state) => state.admin);
//   const dispatch = useDispatch();
//   const [maxPage, setMaxPage] = useState(null);

//   useEffect(() => {
//     dispatch(fetchAllUsers(page)); // ✅ FIX: page pass kiya
//   }, [dispatch, page]);

//   useEffect(() => {
//     if (totalUsers !== undefined) {
//       const newMax = Math.ceil(totalUsers / 10);
//       setMaxPage(newMax || 1);
//     }
//   }, [totalUsers]);

//   useEffect(() => {
//     if (maxPage && page > maxPage) {
//       setPage(maxPage);
//     }
//   }, [maxPage, page]);

//   const handleDeleteUser = (id) => {
//     if (totalUsers === 11) setMaxPage(1);
//     dispatch(DeleteUser(id, page));
//   };

//   return (
//     <>
//       <main className="p-[10px] w-full">
//         <div className="flex-1 md:p-6">
//           <Header />
//           <h1 className="text-2xl font-bold">All Users</h1>
//           <p className="text-sm text-gray-600 mb-6">Manage All Your website's Users</p>

//           <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
//             <div className={`overflow-x-auto rounded-lg ${loading ? "p-10" : users && users.length > 0 ? "shadow-lg" : ""}`}>
//               {loading ? (
//                 <div className="flex justify-center items-center py-20">
//                   <div className="w-14 h-14 border-4 border-blue-500 border-r-transparent rounded-full animate-spin" />
//                 </div>
//               ) : users && users.length > 0 ? (
//                 <>
//                   <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
//                     <thead className="bg-blue-100 text-gray-700">
//                       <tr>
//                         <th className="py-3 px-4 text-left">Avatar</th>
//                         <th className="py-3 px-4 text-left">Name</th>
//                         <th className="py-3 px-4 text-left">Email</th>
//                         <th className="py-3 px-4 text-left">Registered On</th>
//                         <th className="py-3 px-4 text-left">Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {users.map((user, index) => (
//                         <tr key={user._id || index} className="border-t hover:bg-gray-50 transition-colors">
//                           <td className="py-3 px-4">
//                             <img className="w-10 h-10 rounded-full object-cover" src={user?.avatar?.url || avatar} alt={user?.name || "avatar"} />
//                           </td>
//                           <td className="px-3 py-4">{user?.name}</td>
//                           <td className="px-3 py-4">{user?.email}</td>
//                           <td className="px-3 py-4">{new Date(user?.createdAt || user?.created_at).toLocaleDateString()}</td>
//                           <td className="px-3 py-4">
//                            <button
//                               className="text-white rounded-md cursor-pointer px-3 py-2 font-semibold bg-red-500 hover:bg-red-600 active:scale-95 transition-all"
//                               onClick={() => handleDeleteUser(user.id)}
//                             >
//                               Delete
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>

//                   {maxPage > 1 && (
//                     <div className="flex items-center justify-center gap-2 mt-6 mb-5">
//                       <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className="px-4 py-2 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all">← Prev</button>
//                       {Array.from({ length: maxPage }, (_, i) => i + 1).map((p) => (
//                         <button key={p} onClick={() => setPage(p)} className={`px-4 py-2 text-sm rounded-md border transition-all ${page === p ? "bg-blue-500 text-white border-blue-500 font-semibold" : "bg-white border-gray-300 hover:bg-gray-100 text-gray-700"}`}>{p}</button>
//                       ))}
//                       <button onClick={() => setPage((p) => Math.min(p + 1, maxPage))} disabled={page === maxPage} className="px-4 py-2 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all">Next →</button>
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <div className="flex flex-col items-center justify-center py-20 text-gray-400">
//                   <h3 className="text-lg font-medium text-gray-500">No Users Found</h3>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// };

// export default Users;
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Store,
  Trash2,
  Pencil,
  Search,
  Users as UsersIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  X,
} from "lucide-react";
import avatar from "../assets/avatar.jpg";
import Header from "./Header";
import {
  DeleteUser,
  fetchAllUsers,
  makeVendor,
  updateUser, // NEW: add this thunk to adminSlice (see instructions)
} from "../store/slices/adminSlice";

const PAGE_SIZE = 10;
const ROLE_FILTERS = ["All", "User", "Vendor",];

const formatDate = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const getPageNumbers = (page, maxPage) => {
  if (maxPage <= 5) return Array.from({ length: maxPage }, (_, i) => i + 1);
  const pages = new Set([1, maxPage, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= maxPage).sort((a, b) => a - b);
  const result = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push("gap-" + p);
    result.push(p);
  });
  return result;
};

/* ---------- Shared modal shell ---------- */
const ModalShell = ({ labelId, busy, onClose, children }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [busy, onClose]);

  return createPortal(
    <div
      className="us-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        className="us-modal w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

const UserChip = ({ user }) => (
  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
    <img className="h-10 w-10 rounded-full object-cover" src={user?.avatar?.url || avatar} alt="" />
    <div className="min-w-0">
      <p className="truncate text-sm font-medium text-slate-900">{user?.name}</p>
      <p className="truncate text-sm text-slate-500">{user?.email}</p>
    </div>
  </div>
);

/* ---------- Confirm modal (make vendor / delete) ---------- */
const CONFIRM = {
  vendor: {
    icon: ShieldCheck,
    iconBg: "bg-emerald-50 text-emerald-600",
    title: "Make this user a vendor?",
    description:
      "A temporary password will be sent to their email. They can then log in to the vendor dashboard and add products.",
    confirmLabel: "Make vendor",
    busyLabel: "Sending email...",
    confirmClass: "bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500",
  },
  delete: {
    icon: AlertTriangle,
    iconBg: "bg-red-50 text-red-600",
    title: "Delete this user?",
    description: "This permanently removes the account and its data. You can't undo this action.",
    confirmLabel: "Delete user",
    busyLabel: "Deleting...",
    confirmClass: "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500",
  },
};

const ConfirmModal = ({ type, user, busy, onCancel, onConfirm }) => {
  const v = CONFIRM[type];
  const Icon = v.icon;
  return (
    <ModalShell labelId="us-confirm-title" busy={busy} onClose={onCancel}>
      <div className="space-y-5 p-6">
        <div className="flex items-start gap-4">
          <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${v.iconBg}`}>
            <Icon size={22} aria-hidden="true" />
          </div>
          <div>
            <h2 id="us-confirm-title" className="text-lg font-semibold text-slate-900">{v.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">{v.description}</p>
          </div>
        </div>
        <UserChip user={user} />
      </div>
      <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
        <button
          type="button"
          autoFocus
          onClick={onCancel}
          disabled={busy}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className={`inline-flex min-w-[130px] items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${v.confirmClass}`}
        >
          {busy ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              {v.busyLabel}
            </>
          ) : (
            v.confirmLabel
          )}
        </button>
      </div>
    </ModalShell>
  );
};

/* ---------- Edit modal ---------- */
const Field = ({ id, label, error, children }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
    {children}
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

const inputClass = (error) =>
  `w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition
   focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 ${
     error ? "border-red-300 focus:ring-red-200" : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
   }`;

const EditModal = ({ user, busy, onCancel, onSave }) => {
  const isAdmin = user?.role === "Admin";
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "User",
  });
  const [errors, setErrors] = useState({});

  const dirty =
    form.name.trim() !== user?.name || form.email.trim() !== user?.email || form.role !== user?.role;

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (form.name.trim().length < 3) er.name = "Name must be at least 3 characters.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) er.email = "Enter a valid email address.";
    setErrors(er);
    if (Object.keys(er).length === 0) {
      onSave({ name: form.name.trim(), email: form.email.trim(), role: form.role });
    }
  };

  return (
    <ModalShell labelId="us-edit-title" busy={busy} onClose={onCancel}>
      <form onSubmit={submit} noValidate>
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 id="us-edit-title" className="text-lg font-semibold text-slate-900">Edit user</h2>
            <p className="text-sm text-slate-500">Update account details and role.</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <Field id="us-name" label="Full name" error={errors.name}>
            <input id="us-name" autoFocus value={form.name} onChange={set("name")} className={inputClass(errors.name)} />
          </Field>
          <Field id="us-email" label="Email address" error={errors.email}>
            <input id="us-email" type="email" value={form.email} onChange={set("email")} className={inputClass(errors.email)} />
          </Field>
          <Field id="us-role" label="Role">
            <select id="us-role" value={form.role} onChange={set("role")} disabled={isAdmin} className={inputClass()}>
              {isAdmin ? (
                <option value="Admin">Admin</option>
              ) : (
                <>
                  <option value="User">User</option>
                  <option value="Vendor">Vendor</option>
                </>
              )}
            </select>
            {isAdmin ? (
              <p className="mt-1 text-xs text-slate-500">Admin roles can't be changed from here.</p>
            ) : (
              form.role === "Vendor" &&
              user?.role !== "Vendor" && (
                <p className="mt-1 text-xs text-slate-500">
                  Changing the role here won't email a temporary password. Use "Make vendor" for that.
                </p>
              )
            )}
          </Field>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy || !dirty}
            className="inline-flex min-w-[130px] items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            {busy ? (
              <>
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

/* ---------- Small pieces ---------- */
const ROLE_STYLE = {
  Vendor: ["bg-emerald-50 text-emerald-700", "bg-emerald-500"],
  Admin: ["bg-indigo-50 text-indigo-700", "bg-indigo-500"],
  User: ["bg-slate-100 text-slate-600", "bg-slate-400"],
};

const RoleBadge = ({ role }) => {
  const [text, dot] = ROLE_STYLE[role] || ROLE_STYLE.User;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${text}`}>
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {role || "User"}
    </span>
  );
};

const IconAction = ({ label, onClick, tone, children }) => {
  const tones = {
    indigo: "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 focus-visible:ring-indigo-500",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus-visible:ring-emerald-500",
    red: "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 focus-visible:ring-red-500",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition active:scale-95 focus:outline-none focus-visible:ring-2 ${tones[tone]}`}
    >
      {children}
      {label}
    </button>
  );
};

const SkeletonRows = () =>
  Array.from({ length: 6 }, (_, i) => (
    <tr key={i} className="border-t border-slate-100">
      <td className="px-5 py-4"><div className="us-pulse h-10 w-10 rounded-full bg-slate-200" /></td>
      <td className="px-5 py-4"><div className="us-pulse h-4 w-32 rounded bg-slate-200" /></td>
      <td className="px-5 py-4"><div className="us-pulse h-4 w-48 rounded bg-slate-200" /></td>
      <td className="px-5 py-4"><div className="us-pulse h-6 w-16 rounded-full bg-slate-200" /></td>
      <td className="px-5 py-4"><div className="us-pulse h-4 w-24 rounded bg-slate-200" /></td>
      <td className="px-5 py-4"><div className="us-pulse h-8 w-48 rounded bg-slate-200" /></td>
    </tr>
  ));

/* ---------- Page ---------- */
const Users = () => {
  const dispatch = useDispatch();
  const { loading, users, totalUsers } = useSelector((state) => state.admin);

  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(null);
  const [modal, setModal] = useState(null); // { type: "vendor" | "delete" | "edit", user }
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchAllUsers(page));
  }, [dispatch, page]);

  useEffect(() => {
    if (totalUsers !== undefined) setMaxPage(Math.ceil(totalUsers / PAGE_SIZE) || 1);
  }, [totalUsers]);

  useEffect(() => {
    if (maxPage && page > maxPage) setPage(maxPage);
  }, [maxPage, page]);

  // Search and role filter apply to the users loaded on the current page
  const visibleUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (users || []).filter((u) => {
      const roleOk = roleFilter === "All" || (u.role || "User") === roleFilter;
      const textOk = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
      return roleOk && textOk;
    });
  }, [users, query, roleFilter]);

  const closeModal = () => {
    if (!busy) setModal(null);
  };

  const run = async (fn) => {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
      setModal(null);
    }
  };

  const handleConfirm = () =>
    run(async () => {
      if (modal.type === "vendor") {
        await dispatch(makeVendor(modal.user.id, page));
      } else {
        if (totalUsers === PAGE_SIZE + 1) setMaxPage(1);
        await dispatch(DeleteUser(modal.user.id, page));
      }
    });

  const handleSave = (values) => run(() => dispatch(updateUser(modal.user.id, values, page)));

  const hasUsers = users && users.length > 0;
  const filtering = query.trim() !== "" || roleFilter !== "All";

  return (
    <main className="w-full p-[10px]">
      <style>{`
        @keyframes us-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes us-pop { from { opacity: 0; transform: translateY(12px) scale(.96); } to { opacity: 1; transform: none; } }
        @keyframes us-pulse { 50% { opacity: .5 } }
        .us-backdrop { animation: us-fade 180ms ease-out both; }
        .us-modal { animation: us-pop 240ms cubic-bezier(.22,.8,.3,1) both; }
        .us-pulse { animation: us-pulse 1.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .us-backdrop, .us-modal, .us-pulse { animation: none; } }
      `}</style>

      <div className="flex-1 md:p-6">
        <Header />

        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Users and vendors</h1>
            <p className="mt-1 text-sm text-slate-500">Manage customers and vendors on your store.</p>
          </div>
          {totalUsers !== undefined && (
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
              {Number(totalUsers).toLocaleString("en-PK")} total
            </span>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or email"
                aria-label="Search users on this page"
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div role="group" aria-label="Filter by role" className="flex gap-1 rounded-lg bg-slate-100 p-1">
              {ROLE_FILTERS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRoleFilter(r)}
                  aria-pressed={roleFilter === r}
                  className={`rounded-md px-3 py-1 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    roleFilter === r ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {!loading && !hasUsers ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <UsersIcon size={26} aria-hidden="true" />
              </div>
              <h3 className="text-base font-medium text-slate-800">No users yet</h3>
              <p className="mt-1 text-sm text-slate-500">New registrations will show up here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    {["Avatar", "Name", "Email", "Role", "Registered on", "Actions"].map((h) => (
                      <th key={h} scope="col" className="px-5 py-3 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <SkeletonRows />
                  ) : visibleUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                        No users match your search on this page.
                        {filtering && (
                          <button
                            type="button"
                            onClick={() => {
                              setQuery("");
                              setRoleFilter("All");
                            }}
                            className="ml-2 font-medium text-indigo-600 hover:underline"
                          >
                            Clear filters
                          </button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    visibleUsers.map((user, index) => (
                      <tr key={user.id || index} className="border-t border-slate-100 transition-colors hover:bg-slate-50/80">
                        <td className="px-5 py-3">
                          <img
                            className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200"
                            src={user?.avatar?.url || avatar}
                            alt={user?.name || "User avatar"}
                          />
                        </td>
                        <td className="whitespace-nowrap px-5 py-3 font-medium text-slate-900">{user?.name}</td>
                        <td className="px-5 py-3 text-slate-600">{user?.email}</td>
                        <td className="px-5 py-3"><RoleBadge role={user?.role} /></td>
                        <td className="whitespace-nowrap px-5 py-3 text-slate-600">
                          {formatDate(user?.createdAt || user?.created_at)}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex flex-wrap gap-2">
                            <IconAction tone="indigo" label="Edit" onClick={() => setModal({ type: "edit", user })}>
                              <Pencil size={15} aria-hidden="true" />
                            </IconAction>
                            {/* {user?.role === "User" && (
                              <IconAction tone="emerald" label="Make vendor" onClick={() => setModal({ type: "vendor", user })}>
                                <Store size={15} aria-hidden="true" />
                              </IconAction>
                            )} */}
                            {user?.role !== "Admin" && (
                              <IconAction tone="red" label="Delete" onClick={() => setModal({ type: "delete", user })}>
                                <Trash2 size={15} aria-hidden="true" />
                              </IconAction>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && hasUsers && maxPage > 1 && (
            <nav aria-label="Pagination" className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
              <p className="hidden text-sm text-slate-500 sm:block">Page {page} of {maxPage}</p>
              <div className="mx-auto flex items-center gap-1 sm:mx-0">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  aria-label="Previous page"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>
                {getPageNumbers(page, maxPage).map((p) =>
                  typeof p === "string" ? (
                    <span key={p} className="px-1 text-slate-400">...</span>
                  ) : (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      aria-current={page === p ? "page" : undefined}
                      className={`h-9 min-w-[36px] rounded-lg border px-2 text-sm font-medium transition ${
                        page === p
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(p + 1, maxPage))}
                  disabled={page === maxPage}
                  aria-label="Next page"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              </div>
            </nav>
          )}
        </div>
      </div>

      {modal?.type === "edit" && (
        <EditModal user={modal.user} busy={busy} onCancel={closeModal} onSave={handleSave} />
      )}
      {modal && modal.type !== "edit" && (
        <ConfirmModal type={modal.type} user={modal.user} busy={busy} onCancel={closeModal} onConfirm={handleConfirm} />
      )}
    </main>
  );
};

export default Users;