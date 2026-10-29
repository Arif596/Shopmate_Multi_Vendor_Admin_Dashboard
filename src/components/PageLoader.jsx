import { useEffect } from "react";
import { createPortal } from "react-dom";
import { LayoutGrid } from "lucide-react";

const PageLoader = ({ label = "Loading your dashboard..." }) => {
  // loader ke dauran page scroll band
  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, []);

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="pl-root"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100dvh",
        zIndex: 9999,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#020617",
      }}
    >
      <style>{`
        /* loader ke dauran kisi bhi element ka scrollbar nahi dikhega */
        html, body, #root, * { scrollbar-width: none !important; -ms-overflow-style: none !important; }
        *::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }

        @keyframes pl-spin { to { transform: rotate(360deg); } }
        @keyframes pl-pulse { 0%,100% { opacity: .6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.06); } }
        @keyframes pl-bar { 0% { transform: translateX(-100%); } 100% { transform: translateX(250%); } }
        @media (prefers-reduced-motion: reduce) {
          .pl-ring, .pl-logo, .pl-bar { animation: none !important; }
        }
      `}</style>

      {/* soft glow (chhoti screen par bhi bahar nahi nikalta) */}
      <div className="pointer-events-none absolute h-72 w-72 max-w-full rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="relative flex h-24 w-24 items-center justify-center">
        <div
          className="pl-ring absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500"
          style={{ animation: "pl-spin 1s linear infinite" }}
        />
        <div
          className="pl-logo flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/40"
          style={{ animation: "pl-pulse 1.6s ease-in-out infinite" }}
        >
          <LayoutGrid size={26} aria-hidden="true" />
        </div>
      </div>

      <h1 className="relative mt-6 text-lg font-semibold text-white">Admin Panel</h1>
      <p className="relative mt-1 px-4 text-center text-sm text-slate-400">{label}</p>

      <div className="relative mt-5 h-1 w-40 overflow-hidden rounded-full bg-white/10">
        <div
          className="pl-bar h-full w-1/3 rounded-full bg-indigo-500"
          style={{ animation: "pl-bar 1.2s ease-in-out infinite" }}
        />
      </div>
    </div>,
    document.body,
  );
};

export default PageLoader;