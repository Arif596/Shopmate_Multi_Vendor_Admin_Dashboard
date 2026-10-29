import { useSelector } from "react-redux";

const COLORS = ["#818CF8", "#34D399", "#FBBF24"];
const MEDALS = [
  { label: "1st", bg: "#FEF3C7", color: "#92400E" },
  { label: "2nd", bg: "#F1F5F9", color: "#475569" },
  { label: "3rd", bg: "#FFF7ED", color: "#9A3412" },
];

const TopProductsChart = () => {
  const { topProducts } = useSelector((state) => state.admin);
  const top3 = topProducts.slice(0, 3);
  const max = Math.max(...top3.map((p) => p.total_sold));

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            Top selling products
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Top 3 by total sales</p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
          This month
        </span>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-4">
        {top3.map((product, i) => {
          const pct = Math.round((product.total_sold / max) * 100);
          return (
            <div key={i} className="flex items-center gap-3">
              {/* Left: medal + image + name */}
              <div className="flex items-center gap-2.5 w-40 shrink-0">
                <span
                  className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] font-medium shrink-0"
                  style={{ background: MEDALS[i].bg, color: MEDALS[i].color }}
                >
                  {MEDALS[i].label}
                </span>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-9 h-9 rounded-lg object-cover border border-gray-100 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate max-w-[80px]">
                    {product.name}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {product.category}
                  </p>
                </div>
              </div>

              {/* Right: bar + value */}
              <div className="flex flex-1 items-center gap-2.5">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: COLORS[i] }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-500 w-9 text-right shrink-0">
                  {product.total_sold >= 1000
                    ? `${(product.total_sold / 1000).toFixed(1)}k`
                    : product.total_sold}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopProductsChart;
