import React, { useState, useEffect } from "react";
import { LoaderCircle, Plus } from "lucide-react";
import CreateProductModal from "../modals/CreateProductModal";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import UpdateProductModal from "../modals/UpdateProductModal";
import ViewProductModal from "../modals/ViewProductModal";
import {
  toggleCreateProductModalOpened,
  toggleUpdateProductModalOpened,
  toggleViewProductModalOpened,
} from "../store/slices/extraSlice";
import {
  DeleteNewProduct,
  FetchAllproduct,
} from "../store/slices/productsSlice";

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [maxPage, setmaxPage] = useState(null);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const {
    isViewProductModalOpened,
    isCreateProductModalOpened,
    isUpdateProductModalOpened,
  } = useSelector((state) => state.extra);
  const { loading, product, totalProduct, fetchingProduct } = useSelector(
    (state) => state.product,
  );
  useEffect(() => {
    dispatch(FetchAllproduct(page));
  }, [dispatch, page]);
  useEffect(() => {
    if (totalProduct !== undefined) {
      const newMax = Math.ceil(totalProduct / 10);
      setmaxPage(newMax || 1);
    }
  }, [totalProduct]);
  useEffect(() => {
    if (maxPage && page > maxPage) {
      setPage(maxPage);
    }
  }, [maxPage, page]);
  return (
    <>
      <main className="p-[10px] pl-[10px] w-full">
        <div className="flex-1 md:p-6">
          <Header />
          <h1 className="text-2xl font-bold">All Products</h1>
          <p className="text-sm text-gray-600 mb-6">Manage All Your Product</p>
          <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
            <div
              className={`overflow-x-auto rounded-lg ${fetchingProduct ? "p-10" : product && product.length > 0 ? "shadow-lg" : ""}`}
            >
              {fetchingProduct ? (
                <div className="flex justify-center items-center py-20">
                  <div className="w-14 h-14 border-4 border-blue-500 border-r-transparent rounded-full animate-spin" />
                </div>
              ) : product && product.length > 0 ? (
                <>
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-blue-100 text-gray-700">
                      <tr>
                        <th className="py-3 px-4 text-left">Image</th>
                        <th className="py-3 px-4 text-left">Title</th>
                        <th className="py-3 px-4 text-left">Category</th>
                        <th className="py-3 px-4 text-left">Price</th>
                        <th className="py-3 px-4 text-left">Stock</th>
                        <th className="py-3 px-4 text-left">Ratings</th>
                        <th className="py-3 px-4 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.map((product, index) => (
                        <tr
                          onClick={() => {
                            (setSelectedProduct(product),
                              dispatch(toggleViewProductModalOpened()));
                          }}
                          key={product.id || index}
                          className="border-t hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <img
                              className="w-10 h-10 rounded-md object-cover"
                              src={product?.images[0]?.url}
                              alt={product?.name}
                            />
                          </td>
                          <td className="px-3 py-4">{product?.name}</td>
                          <td className="px-3 py-4">{product?.category}</td>
                          <td className="px-3 py-4">{product?.price}</td>
                          <td className="px-3 py-4">{product?.stock}</td>
                          <td className="px-3 py-4 text-yellow-500">
                            {product?.ratings}
                          </td>
                          <td className="px-4 py-3 flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                (setSelectedProduct(product),
                                  dispatch(toggleUpdateProductModalOpened()));
                              }}
                              className="text-white rounded-md cursor-pointer px-3 py-2 font-semibold bg-blue-gradient"
                            >
                              Update
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProduct(product);
                                dispatch(DeleteNewProduct(product.id, page));
                              }}
                              className="text-white bg-red-gradient rounded-md cursor-pointer px-3 py-2 font-semibold flex items-center justify-center gap-2 min-w-[100px]"
                            >
                              {selectedProduct?.id === product.id && loading ? (
                                <>
                                  <LoaderCircle className="w-6 h-6 animate-spin" />
                                </>
                              ) : (
                                "Delete..."
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {maxPage > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6 mb-5">
                      <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="px-4 py-2 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      >
                        ← Prev
                      </button>
                      {Array.from({ length: maxPage }, (_, i) => i + 1).map(
                        (p) => (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`px-4 py-2 text-sm rounded-md border transition-all ${page === p ? "bg-blue-500 text-white border-blue-500 font-semibold" : "bg-white border-gray-300 hover:bg-gray-100 text-gray-700"}`}
                          >
                            {p}
                          </button>
                        ),
                      )}
                      <button
                        onClick={() => setPage((p) => Math.min(p + 1, maxPage))}
                        disabled={page === maxPage}
                        className="px-4 py-2 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <h3 className="text-lg font-medium text-gray-500">
                    No Product Found
                  </h3>
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => dispatch(toggleCreateProductModalOpened())}
          title="Create New Product"
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-50 transition-all duration-300"
        >
          <Plus size={20} />
        </button>
      </main>
      {isCreateProductModalOpened && <CreateProductModal />}
      {isUpdateProductModalOpened && (
        <UpdateProductModal selectedProduct={selectedProduct} />
      )}
      {isViewProductModalOpened && (
        <ViewProductModal selectedProduct={selectedProduct} />
      )}
    </>
  );
};

export default Products;
