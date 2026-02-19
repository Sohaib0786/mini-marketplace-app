import { useState, useEffect, useCallback } from "react";
import { productsAPI } from "../services/api";
import ProductCard from "../components/product/ProductCard";
import SearchBar from "../components/common/SearchBar";
import Pagination from "../components/common/Pagination";
import { ProductSkeleton } from "../components/common/Skeleton";

const CATS = [
  "All",
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports",
  "Books",
  "Toys",
  "Beauty",
  "Food",
  "Other",
];

const SORTS = [
  { v: "createdAt-desc", l: "Newest first" },
  { v: "price-asc", l: "Price: low → high" },
  { v: "price-desc", l: "Price: high → low" },
  { v: "rating-desc", l: "Top rated" },
  { v: "title-asc", l: "A → Z" },
];

/* ───────────────── HERO ───────────────── */
function Hero({ total }) {
  return (
    <div className="text-center py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-10" />

      <div className="inline-block px-4 py-1 mb-6 text-xs font-semibold tracking-wider uppercase rounded-full bg-indigo-100 text-indigo-600">
        {total > 0 ? `${total} Products Available` : "Curated Collection"}
      </div>

      <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
        Discover{" "}
        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-transparent bg-clip-text">
          Remarkable Products
        </span>
      </h1>

      <p className="text-gray-500 max-w-xl mx-auto text-lg">
        A curated marketplace of quality goods — find what you need and
        discover what you didn't know you wanted.
      </p>
    </div>
  );
}

/* ───────────────── MAIN ───────────────── */
export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("createdAt-desc");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sortBy, sortOrder] = sort.split("-");
      const { data } = await productsAPI.getAll({
        search,
        page,
        limit: 9,
        category: cat === "All" ? "" : cat,
        sortBy,
        sortOrder,
      });

      setProducts(data.data.products);
      setPagination(data.data.pagination);
    } catch {
      setError("Cannot reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [search, cat, sort, page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [search, cat, sort]);

  return (
    <div className="container mx-auto px-4">
      <Hero total={pagination.totalProducts ?? 0} />

      {/* ───────────── FILTER BAR ───────────── */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-10 border border-gray-100 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="flex-1">
            <SearchBar onSearch={setSearch} initialValue={search} />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-600"
          >
            {SORTS.map((s) => (
              <option key={s.v} value={s.v}>
                {s.l}
              </option>
            ))}
          </select>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mt-6">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200
                ${
                  cat === c
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600"
                }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ───────────── META ROW ───────────── */}
      {!loading && !error && (
        <div className="flex justify-between items-center mb-6 text-sm text-gray-500">
          <p>
            <span className="font-semibold text-indigo-600">
              {pagination.totalProducts ?? 0}
            </span>{" "}
            products
          </p>
          {(pagination.totalPages ?? 1) > 1 && (
            <p>
              Page {page} of {pagination.totalPages}
            </p>
          )}
        </div>
      )}

      {/* ───────────── ERROR ───────────── */}
      {error && (
        <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-200">
          <p className="text-5xl mb-4">⚠️</p>
          <h3 className="text-xl font-semibold text-red-600 mb-2">
            Connection Error
          </h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={load}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Try Again
          </button>
        </div>
      )}

      {/* ───────────── GRID ───────────── */}
      {!error && (
        <>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 9 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))
              : products.map((p) => (
                  <div
                    key={p._id}
                    className="transform hover:-translate-y-1 transition duration-300"
                  >
                    <ProductCard product={p} />
                  </div>
                ))}
          </div>

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-6xl mb-4">🔍</p>
              <h3 className="text-2xl font-semibold mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setCat("All");
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Clear Filters
              </button>
            </div>
          )}

          <div className="mt-12">
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages ?? 1}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
