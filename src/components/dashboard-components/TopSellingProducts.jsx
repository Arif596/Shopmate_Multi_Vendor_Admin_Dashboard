import React from "react";
import { useSelector } from "react-redux";

const rankStyle = (index) => {
  const base = "w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium";
  if (index === 0) return `${base} bg-amber-100 text-amber-800 border border-amber-300`;
  if (index === 1) return `${base} bg-slate-100 text-slate-600 border border-slate-300`;
  if (index === 2) return `${base} bg-orange-50 text-orange-700 border border-orange-200`;
  return `${base} bg-gray-100 text-gray-500 border border-gray-200`;
};

const TopSellingProducts = () => {
  const { topProducts } = useSelector((state) => state.admin);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 xl:col-span-2 max-h-[560px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
      <h2 className="text-base font-medium text-gray-900">Top Products</h2>
      <p className="text-xs text-gray-400 mt-0.5 mb-5">Products with highest sales</p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pb-3 px-3 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider">#</th>
              <th className="pb-3 px-3 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider">Product</th>
              <th className="pb-3 px-3 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider">Category</th>
              <th className="pb-3 px-3 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider">Total Sold</th>
              <th className="pb-3 px-3 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider">Rating</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.length > 0 &&
              topProducts.map((element, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors last:border-0">

                  <td className="px-3 py-3">
                    <div className={rankStyle(index)}>{index + 1}</div>
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                        src={element.image}
                        alt={element.name}
                      />
                      <span className="font-medium text-gray-800 text-sm">{element.name}</span>
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <span className="inline-block text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                      {element.category}
                    </span>
                  </td>

                  <td className="px-3 py-3 font-medium text-gray-800">
                    {element.total_sold.toLocaleString()}
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-400 text-sm">★</span>
                      <span className="font-medium text-gray-700">{element.ratings}</span>
                    </div>
                  </td>

                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSellingProducts;