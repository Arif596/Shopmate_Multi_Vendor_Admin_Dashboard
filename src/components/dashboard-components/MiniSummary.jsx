import React, { useEffect, useRef, useState } from "react";
import {
  Wallet,
  PackageCheck,
  TrendingUp,
  AlertTriangle,
  BarChart4,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useSelector } from "react-redux";

// Change this if your exchange rate changes (USD -> PKR)
const USD_TO_PKR = 283;

/* ---------- Count-up hook ---------- */
const useCountUp = (target, duration = 1100) => {
  const [value, setValue] = useState(0);
  const frame = useRef(null);

  useEffect(() => {
    const end = Number(target) || 0;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || end === 0) {
      setValue(end);
      return;
    }

    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(end * eased);
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame.current);
  }, [target, duration]);

  return value;
};

const AnimatedNumber = ({ value, prefix = "" }) => {
  const current = useCountUp(value);
  return (
    <span className="tabular-nums">
      {prefix}
      {Math.round(current).toLocaleString("en-PK")}
    </span>
  );
};

/* ---------- Single row ---------- */
const SummaryRow = ({ item, index }) => {
  const Icon = item.icon;

  return (
    <li
      className="ms-row group flex items-center gap-4 rounded-xl px-3 py-3
        transition-colors duration-200 hover:bg-slate-50"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div
        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl
          transition-transform duration-200 group-hover:scale-105 ${item.tint}`}
      >
        <Icon size={20} strokeWidth={2} aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm text-slate-500">{item.label}</p>
        <p className="truncate text-lg font-semibold text-slate-900">
          {item.numeric !== undefined ? (
            <AnimatedNumber value={item.numeric} prefix={item.prefix} />
          ) : (
            item.text
          )}
        </p>
      </div>

      {item.note && (
        <span
          className={`flex flex-shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
            item.noteTone || "bg-slate-100 text-slate-600"
          }`}
        >
          {item.noteIcon}
          {item.note}
        </span>
      )}
    </li>
  );
};

/* ---------- Main component ---------- */
const MiniSummary = () => {
  const {
    lowStockProducts,
    orderStatusCounts,
    newUserThisMonth,
    revenueGrowth,
    topProducts,
    currentMonthSale,
  } = useSelector((state) => state.admin);

  const totalOrders = Object.values(orderStatusCounts || {}).reduce(
    (acc, count) => acc + Number(count || 0),
    0,
  );

  const growthText = String(revenueGrowth ?? "0%");
  const growthUp = !growthText.trim().startsWith("-");
  const bestSeller = topProducts?.[0];

  const summary = [
    {
      label: "Sales this month",
      numeric: (Number(currentMonthSale) || 0) * USD_TO_PKR,
      prefix: "PKR ",
      icon: Wallet,
      tint: "bg-green-50 text-green-600",
    },
    {
      label: "Orders placed",
      numeric: totalOrders,
      icon: PackageCheck,
      tint: "bg-blue-50 text-blue-600",
    },
    {
      label: "Best seller",
      text: bestSeller?.name || "No sales yet",
      note: bestSeller ? `${bestSeller.total_sold} sold` : null,
      noteTone: "bg-emerald-50 text-emerald-700",
      icon: TrendingUp,
      tint: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Low stock products",
      numeric: Number(lowStockProducts) || 0,
      note: Number(lowStockProducts) > 0 ? "Restock soon" : "All good",
      noteTone:
        Number(lowStockProducts) > 0
          ? "bg-red-50 text-red-700"
          : "bg-slate-100 text-slate-600",
      icon: AlertTriangle,
      tint: "bg-red-50 text-red-600",
    },
    {
      label: "Revenue vs last month",
      text: growthText,
      note: growthUp ? "Up" : "Down",
      noteTone: growthUp
        ? "bg-green-50 text-green-700"
        : "bg-red-50 text-red-700",
      noteIcon: growthUp ? (
        <ArrowUpRight size={14} aria-hidden="true" />
      ) : (
        <ArrowDownRight size={14} aria-hidden="true" />
      ),
      icon: BarChart4,
      tint: "bg-purple-50 text-purple-600",
    },
    {
      label: "New customers this month",
      numeric: Number(newUserThisMonth) || 0,
      icon: UserPlus,
      tint: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <section
      aria-labelledby="summary-heading"
      className="ms-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Local keyframes, so no extra Tailwind config is needed */}
      <style>{`
        @keyframes ms-card-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ms-row-in {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .ms-card { animation: ms-card-in 450ms ease-out both; }
        .ms-row  { animation: ms-row-in 500ms cubic-bezier(.22,.8,.3,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .ms-card, .ms-row { animation: none; }
        }
      `}</style>

      <header className="border-b border-slate-100 px-6 py-5">
        <h2 id="summary-heading" className="text-lg font-semibold text-slate-900">
          Summary
        </h2>
        <p className="mt-0.5 text-sm text-slate-500">
          Key numbers for the current month
        </p>
      </header>

      <ul className="space-y-1 p-3">
        {summary.map((item, index) => (
          <SummaryRow key={item.label} item={item} index={index} />
        ))}
      </ul>
    </section>
  );
};

export default MiniSummary;