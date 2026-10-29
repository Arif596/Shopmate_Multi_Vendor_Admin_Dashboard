import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import {
  Deleteorder,
  FetchAllOrders,
  UpdateOrdersStatus,
} from "../store/slices/orderSlice";

const statusConfig = {
  Processing: {
    text: "text-amber-600",
    bg: "bg-amber-100",
    border: "border-amber-200",
    icon: "⏳",
  },
  Shipped: {
    text: "text-blue-600",
    bg: "bg-blue-100",
    border: "border-blue-200",
    icon: "🚚",
  },
  Cancelled: {
    text: "text-red-600",
    bg: "bg-red-100",
    border: "border-red-200",
    icon: "✕",
  },
  Delivered: {
    text: "text-green-600",
    bg: "bg-green-100",
    border: "border-green-200",
    icon: "✓",
  },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.Processing;
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.text} ${cfg.bg} ${cfg.border}`}
    >
      <span>{cfg.icon}</span>
      {status}
    </span>
  );
};

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);

  const [selectedStatus, setSelectedStatus] = useState({});
  const [filterByStatus, setFilterByStatus] = useState("All");
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    dispatch(FetchAllOrders());
  }, [dispatch]);

  const handleChangeStatus = (orderId, newStatus) => {
    setSelectedStatus((prev) => ({ ...prev, [orderId]: newStatus }));
    dispatch(UpdateOrdersStatus({ orderId, status: newStatus }));
  };

  const filteredOrder =
    filterByStatus === "All"
      ? orders
      : orders?.filter((order) => order.order_status === filterByStatus);

  const confirmDelete = () => {
    dispatch(Deleteorder(deleteConfirm.id)).then(()=>{
      dispatch(FetchAllOrders())
    });
    setDeleteConfirm({ open: false, id: null });
  };

  const StatusArray = [
    "All",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  return (
    <div className="min-h-screen bg-gray-50 ms-4">
      <main className="min-h-screen">
        <div className="p-4">
          <div className="bg-white rounded-2xl w-full border border-gray-200 shadow-sm px-6 pt-4 pb-4 mb-4">
            <div className="flex items-center justify-between">
              <Header />
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold px-4 py-1.5 rounded-xl shadow-sm whitespace-nowrap">
                {filteredOrder?.length || 0} Orders
              </span>
            </div>
            <div className="mt-2">
              <h1 className="text-xl font-bold text-gray-900 leading-tight">
                All Orders
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Manage and track your store orders
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-sm font-medium text-gray-400">
                Fetching orders...
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {["Processing", "Shipped", "Delivered", "Cancelled"].map(
                  (s) => {
                    const cfg = statusConfig[s];
                    return (
                      <div
                        key={s}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3"
                      >
                        <p
                          className={`text-xs font-bold uppercase tracking-widest ${cfg.text}`}
                        >
                          {s}
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-0.5 font-mono">
                          {orders?.filter((o) => o.order_status === s).length ||
                            0}
                        </p>
                      </div>
                    );
                  },
                )}
              </div>

              {/* Filter Toolbar */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-2.5 mb-4 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-1">
                  Filter:
                </span>
                {StatusArray.map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterByStatus(s)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150
                      ${
                        filterByStatus === s
                          ? "bg-indigo-500 border-indigo-500 text-white shadow-sm"
                          : "bg-transparent border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-500"
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Orders List */}
              {filteredOrder?.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-5xl mb-3">📦</p>
                  <p className="text-base font-semibold text-gray-500">
                    No orders found
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try changing the filter
                  </p>
                </div>
              ) : (
                filteredOrder?.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-gray-200 rounded-2xl mb-3 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {/* Card Top */}
                    <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-2.5 bg-gray-50 border-b border-gray-100">
                      <span className="font-mono text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-md">
                        #{order.id}
                      </span>
                      <StatusBadge status={order.order_status} />
                    </div>

                    {/* Card Body */}
                    <div className="px-5 py-4 flex items-center justify-between flex-wrap gap-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Status
                          </p>
                          <p className="text-sm font-semibold text-gray-800">
                            {order.order_status}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Placed At
                          </p>
                          <p className="text-sm font-semibold text-gray-800">
                            {new Date(order.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Total Amount
                          </p>
                          <p className="text-base font-bold text-green-600 font-mono">
                            ${order.total_price}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <select
                          className="text-sm font-medium px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 cursor-pointer outline-none focus:border-indigo-400 hover:border-indigo-400 transition-colors min-w-36"
                          value={selectedStatus[order.id] || order.order_status}
                          onChange={(e) =>
                            handleChangeStatus(order.id, e.target.value)
                          }
                        >
                          {StatusArray.filter((s) => s !== "All").map(
                            (status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ),
                          )}
                        </select>

                        <button
                          onClick={() =>
                            setDeleteConfirm({ open: true, id: order.id })
                          }
                          className="flex items-center gap-1.5 px-3 py-2 border border-red-200 bg-red-50 text-red-500 text-sm font-semibold rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-150"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="mx-5 mb-5 rounded-xl border border-indigo-100 bg-indigo-50/50 overflow-hidden">
                      {/* Section Header */}
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-indigo-100/60 border-b border-indigo-100">
                        <span className="text-sm">📦</span>
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                          Shipping Info
                        </p>
                      </div>

                      {/* Info Grid */}
                      <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Name */}
                        <div className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs">👤</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                              Name
                            </p>
                            <p className="text-sm font-semibold text-gray-800">
                              {order.shipping_info?.full_name || "—"}
                            </p>
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs">📞</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                              Phone
                            </p>
                            <p className="text-sm font-semibold text-gray-800">
                              {order.shipping_info?.phone || "—"}
                            </p>
                          </div>
                        </div>

                        {/* Address */}
                        <div className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs">📍</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                              Address
                            </p>
                            <p className="text-sm font-semibold text-gray-800 leading-snug">
                              {[
                                order.shipping_info?.address,
                                order.shipping_info?.city,
                                order.shipping_info?.state,
                                order.shipping_info?.pincode,
                              ]
                                .filter(Boolean)
                                .join(", ") || "—"}
                            </p>
                          </div>
                        </div>

                        {/* Order Items */}
                        {(() => {
                          const items =
                            order.order_item || order.order_items || [];
                          if (!items.length) return null;
                          return (
                            <div className="col-span-1 sm:col-span-3 mt-3 pt-3 border-t border-indigo-100">
                              <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <span>🛒</span> Order Items
                                <span className="bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full text-xs font-bold">
                                  {items.length}
                                </span>
                              </p>
                              <div className="flex flex-col gap-2">
                                {items.map((item, idx) => (
                                  <div
                                    key={item.order_item_id || item.id || idx}
                                    className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2.5 hover:shadow-md hover:border-indigo-200 transition-all duration-150"
                                  >
                                    {/* Image */}
                                    {item.image ? (
                                      <img
                                        onClick={() =>
                                          setPreviewImage(item.image)
                                        }
                                        className="w-14 h-14 object-cover rounded-lg border border-gray-200 cursor-zoom-in hover:scale-105 transition-transform duration-150 flex-shrink-0"
                                        src={item.image}
                                        alt={item.title}
                                        onError={(e) => {
                                          e.target.style.display = "none";
                                        }}
                                      />
                                    ) : (
                                      <div className="w-14 h-14 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center flex-shrink-0 text-2xl">
                                        📷
                                      </div>
                                    )}

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-gray-800 truncate leading-tight">
                                        {item.title || item.name || "Product"}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                        <span className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full font-semibold">
                                          Qty: {item.quantity}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                          ${item.price} × {item.quantity}
                                        </span>
                                        <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                                          ${item.quantity * item.price}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {/* Image Preview */}
              {previewImage && (
                <div
                  onClick={() => setPreviewImage(null)}
                  className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
                >
                  <img
                    src={previewImage}
                    alt=""
                    className="max-x-[90%] max-h-[90%] rounded shadow-xl"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setDeleteConfirm({ open: false, id: null })}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-sm w-11/12 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              🗑
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Delete Order?
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. Order{" "}
              <strong className="text-gray-800">#{deleteConfirm.id}</strong>{" "}
              will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm({ open: false, id: null })}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-semibold text-white transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
