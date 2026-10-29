import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleViewProductModalOpened } from "../store/slices/extraSlice";
import { X, Tag, Star, Package, Calendar, Hash, AlignLeft } from "lucide-react";

const ViewProductModal = ({ selectedProduct }) => {
  const dispatch = useDispatch();
  const [activeImg, setActiveImg] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={() => dispatch(toggleViewProductModalOpened())}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white truncate max-w-xs">
                {selectedProduct.name}
              </h2>
              <p className="text-purple-100 text-xs mt-0.5">{selectedProduct.category}</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(toggleViewProductModalOpened())}
            className="bg-white/20 hover:bg-white/30 text-white rounded-xl p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Left — Image Gallery */}
            <div className="space-y-3">
              {/* Main Image */}
              <div className="w-full aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                <img
                  src={selectedProduct.images[activeImg]?.url}
                  alt={`Product ${activeImg}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Thumbnails */}
              {selectedProduct.images.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImg(idx)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImg === idx
                          ? "border-violet-500 shadow-md scale-105"
                          : "border-gray-200 hover:border-violet-300"
                      }`}
                    >
                      <img
                        src={img?.url}
                        alt={`thumb-${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right — Product Info */}
            <div className="space-y-4">

              {/* Price + Stock Badge */}
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-gray-900">
                  ₨ {Number(selectedProduct.price).toLocaleString()}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedProduct.stock > 5
                      ? "bg-green-100 text-green-700"
                      : selectedProduct.stock > 0
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {selectedProduct.stock > 5
                    ? "In Stock"
                    : selectedProduct.stock > 0
                    ? "Limited Stock"
                    : "Out of Stock"}
                </span>
              </div>

              {/* Ratings */}
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(selectedProduct.ratings)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 fill-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-1">
                  ({selectedProduct.ratings})
                </span>
              </div>

              <hr className="border-gray-100" />

              {/* Info Grid */}
              <div className="space-y-3">

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <AlignLeft className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Description</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{selectedProduct.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Tag className="w-4 h-4 text-violet-400 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</p>
                      <p className="text-sm text-gray-800 font-medium">{selectedProduct.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Package className="w-4 h-4 text-violet-400 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Stock</p>
                      <p className="text-sm text-gray-800 font-medium">{selectedProduct.stock} units</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Calendar className="w-4 h-4 text-violet-400 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Created</p>
                      <p className="text-sm text-gray-800 font-medium">
                        {new Date(selectedProduct.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Hash className="w-4 h-4 text-violet-400 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Product ID</p>
                      <p className="text-sm text-gray-800 font-medium truncate max-w-[90px]" title={selectedProduct.id}>
                        {selectedProduct.id.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductModal;