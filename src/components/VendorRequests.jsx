import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Check,
  X,
  Loader2,
  Inbox,
  ShieldCheck,
  AlertTriangle,
  Mail,
  CalendarDays,
} from "lucide-react";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";
import Header from "./Header";

const TABS = ["pending", "approved", "rejected"];
const MAX_REASON = 500;

const STATUS_STYLE = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
};

const formatDate = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const initials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";

/* ---------- Modal shell ---------- */
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

const RequestChip = ({ request }) => (
  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
      {initials(request.name)}
    </div>
    <div className="min-w-0">
      <p className="truncate text-sm font-medium text-slate-900">{request.name}</p>
      <p className="truncate text-sm text-slate-500">{request.email}</p>
    </div>
  </div>
);

/* ---------- Approve / Reject modal ---------- */
const DecisionModal = ({ type, request, busy, onCancel, onConfirm }) => {
  const isApprove = type === "approve";
  const [reason, setReason] = useState("");

  return (
    <ModalShell labelId="vr-title" busy={busy} onClose={onCancel}>
      <div className="space-y-5 p-6">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${
              isApprove ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
            }`}
          >
            {isApprove ? <ShieldCheck size={22} aria-hidden="true" /> : <AlertTriangle size={22} aria-hidden="true" />}
          </div>
          <div>
            <h2 id="vr-title" className="text-lg font-semibold text-slate-900">
              {isApprove ? "Approve this vendor request?" : "Decline this vendor request?"}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              {isApprove
                ? "This user will become a vendor. A temporary password will be emailed to them so they can log in to the vendor dashboard."
                : "The user will be notified by email that their request was declined."}
            </p>
          </div>
        </div>

        <RequestChip request={request} />

        {!isApprove && (
          <div>
            <label htmlFor="vr-reason" className="mb-1.5 flex items-center justify-between text-sm font-medium text-slate-700">
              <span>
                Reason <span className="font-normal text-slate-400">(optional)</span>
              </span>
              <span className="text-xs font-normal text-slate-400">
                {reason.length}/{MAX_REASON}
              </span>
            </label>
            <textarea
              id="vr-reason"
              rows={4}
              maxLength={MAX_REASON}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={busy}
              placeholder="Tell the user why the request was declined. This will be included in the email."
              className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 disabled:bg-slate-50"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
        <button
          type="button"
          autoFocus
          onClick={onCancel}
          disabled={busy}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onConfirm(isApprove ? undefined : { reason: reason.trim() })}
          disabled={busy}
          className={`inline-flex min-w-[140px] items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-80 ${
            isApprove ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {busy ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              {isApprove ? "Sending email..." : "Declining..."}
            </>
          ) : isApprove ? (
            "Yes, make vendor"
          ) : (
            "Decline request"
          )}
        </button>
      </div>
    </ModalShell>
  );
};

/* ---------- Request card ---------- */
const RequestCard = ({ request, onApprove, onReject }) => (
  <li className="rounded-xl border border-slate-200 bg-white p-5 transition hover:shadow-sm">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
          {initials(request.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">{request.name}</p>
          <p className="flex items-center gap-1.5 truncate text-sm text-slate-500">
            <Mail size={13} aria-hidden="true" />
            {request.email}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <CalendarDays size={13} aria-hidden="true" />
          {formatDate(request.created_at)}
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ${STATUS_STYLE[request.status]}`}
        >
          {request.status}
        </span>
      </div>
    </div>

    <div className="mt-4">
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">Reason for applying</p>
      <p className="whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
        {request.reason}
      </p>
    </div>

    {request.status === "rejected" && (
      <div className="mt-3">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">Admin's decline reason</p>
        <p className="whitespace-pre-wrap break-words rounded-lg bg-red-50 p-3 text-sm leading-relaxed text-red-800">
          {request.rejection_reason || "No reason provided."}
        </p>
      </div>
    )}

    {request.status !== "pending" && request.reviewed_at && (
      <p className="mt-3 text-xs text-slate-400">
        {request.status === "approved" ? "Approved" : "Declined"} on {formatDate(request.reviewed_at)}
      </p>
    )}

    {request.status === "pending" && (
      <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => onReject(request)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 active:scale-95"
        >
          <X size={15} aria-hidden="true" /> Decline
        </button>
        <button
          type="button"
          onClick={() => onApprove(request)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 active:scale-95"
        >
          <Check size={15} aria-hidden="true" /> Approve
        </button>
      </div>
    )}
  </li>
);

const SkeletonCards = () =>
  Array.from({ length: 3 }, (_, i) => (
    <li key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-full bg-slate-200" />
        <div className="space-y-2">
          <div className="h-4 w-36 rounded bg-slate-200" />
          <div className="h-3 w-48 rounded bg-slate-200" />
        </div>
      </div>
      <div className="mt-4 h-16 rounded-lg bg-slate-100" />
    </li>
  ));

/* ---------- Page ---------- */
const VendorRequests = () => {
  const [status, setStatus] = useState("pending");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { type: "approve" | "reject", request }
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/vendor-requests?status=${status}`);
      setRequests(data.requests || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  const closeModal = () => {
    if (!busy) setModal(null);
  };

  const handleConfirm = async (body) => {
    const { type, request } = modal;
    setBusy(true);
    try {
      const { data } = await axiosInstance.patch(`/vendor-requests/${request.id}/${type}`, body || {});
      toast.success(data.message);
      setRequests((list) => list.filter((r) => r.id !== request.id));
      setModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="w-full p-[10px]">
      <div className="flex-1 md:p-6">
        <Header />

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Vendor requests</h1>
          <p className="mt-1 text-sm text-slate-500">Review users who want to sell on your store.</p>
        </div>

        <div className="mb-5 inline-flex gap-1 rounded-lg bg-slate-100 p-1" role="group" aria-label="Filter by status">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setStatus(t)}
              aria-pressed={status === t}
              className={`rounded-md px-4 py-1.5 text-sm font-medium capitalize transition ${
                status === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <ul className="space-y-4">
            <SkeletonCards />
          </ul>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Inbox size={26} aria-hidden="true" />
            </div>
            <h3 className="text-base font-medium text-slate-800">No {status} requests</h3>
            <p className="mt-1 text-sm text-slate-500">
              {status === "pending" ? "New vendor requests will show up here." : `Nothing has been ${status} yet.`}
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {requests.map((r) => (
              <RequestCard
                key={r.id}
                request={r}
                onApprove={(request) => setModal({ type: "approve", request })}
                onReject={(request) => setModal({ type: "reject", request })}
              />
            ))}
          </ul>
        )}
      </div>

      {modal && (
        <DecisionModal
          key={modal.request.id + modal.type}
          type={modal.type}
          request={modal.request}
          busy={busy}
          onCancel={closeModal}
          onConfirm={handleConfirm}
        />
      )}
    </main>
  );
};

export default VendorRequests;