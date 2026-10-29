import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { formatNumber } from "../../lib/helper";
import { toggleComponent } from "../../store/slices/extraSlice";

/* ---------- Count-up hook (respects reduced motion) ---------- */
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
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(end * eased);
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame.current);
  }, [target, duration]);

  return value;
};

const AnimatedValue = ({ value, format }) => {
  const current = useCountUp(value);
  return <span className="tabular-nums">{format(current)}</span>;
};

/* ---------- Single card ---------- */
const StatCard = ({ stat, index, onNavigate }) => {
  const Icon = stat.icon;
  const isClickable = Boolean(stat.target);

  const content = (
    <div className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{stat.title}</p>
        <div className={`rounded-xl p-2.5 ${stat.iconBg}`}>
          <Icon className={`h-4 w-4 ${stat.iconColor}`} aria-hidden="true" />
        </div>
      </div>

      <p className="text-3xl font-semibold tracking-tight text-slate-900">
        <AnimatedValue value={stat.rawValue} format={stat.format} />
      </p>

      <div className="mt-3 flex h-6 items-center justify-between">
        {stat.change ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
              stat.change.positive
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {stat.change.positive ? (
              <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {stat.change.label}
          </span>
        ) : (
          <span className="text-xs text-slate-400">{stat.hint}</span>
        )}

        {isClickable && (
          <span className="flex items-center text-xs font-medium text-slate-400 transition-colors group-hover:text-indigo-600">
            View users
            <ChevronRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        )}
      </div>
    </div>
  );

  const baseClasses =
    "st-card group block w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm";

  const style = { animationDelay: `${index * 90}ms` };

  if (isClickable) {
    return (
      <button
        type="button"
        onClick={() => onNavigate(stat.target)}
        aria-label={`${stat.title}: open ${stat.target} page`}
        style={style}
        className={`${baseClasses} cursor-pointer transition duration-200
          hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md
          focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2`}
      >
        {content}
      </button>
    );
  }

  return (
    <div style={style} className={baseClasses}>
      {content}
    </div>
  );
};

/* ---------- Main component ---------- */
const Stats = () => {
  const dispatch = useDispatch();

  const {
    totaluserCount,
    totalRevinueAllTime,
    todayRevinueResult,
    yesterdayRevinueResult,
  } = useSelector((state) => state.admin);

  const revenueChange = useMemo(() => {
    const today = Number(todayRevinueResult) || 0;
    const yesterday = Number(yesterdayRevinueResult) || 0;

    let change = 0;
    if (yesterday === 0 && today === 0) change = 0;
    else if (yesterday === 0) change = 100;
    else change = ((today - yesterday) / yesterday) * 100;

    return {
      positive: change >= 0,
      label: `${change >= 0 ? "+" : ""}${change.toFixed(2)}% vs yesterday`,
    };
  }, [todayRevinueResult, yesterdayRevinueResult]);

  const stats = [
    {
      title: "Today's revenue",
      rawValue: Number(todayRevinueResult) || 0,
      format: (v) => formatNumber(v),
      change: revenueChange,
      icon: DollarSign,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total users",
      rawValue: Number(totaluserCount) || 0,
      format: (v) => Math.round(v).toLocaleString("en-PK"),
      hint: "Registered customers",
      icon: Users,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      target: "Users", // same title the sidebar dispatches
    },
    {
      title: "All-time revenue",
      rawValue: Number(totalRevinueAllTime) || 0,
      format: (v) => formatNumber(v),
      hint: "Since launch",
      icon: BarChart3,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
  ];

  const handleNavigate = (target) => dispatch(toggleComponent(target));

  return (
    <>
      <style>{`
        @keyframes st-card-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .st-card { animation: st-card-in 450ms ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .st-card { animation: none; }
        }
      `}</style>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            stat={stat}
            index={index}
            onNavigate={handleNavigate}
          />
        ))}
      </div>
    </>
  );
};

export default Stats;