import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { favoritesAPI } from "../services/api";
import ProductCard from "../components/product/ProductCard";
import { ProductSkeleton } from "../components/common/Skeleton";

export default function FavoritesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    favoritesAPI
      .getAll()
      .then(({ data }) => setItems(data.data.favorites))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = (id) =>
    setItems((prev) => prev.filter((p) => p._id !== id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-12 text-center">
          <span className="inline-block px-5 py-2 text-xs font-semibold tracking-widest uppercase text-rose-600 bg-rose-100 rounded-full shadow-sm">
            ♥ Your Collection
          </span>

          <h1 className="mt-6 text-4xl md:text-5xl font-serif font-bold text-gray-800">
            Saved Favourites
          </h1>

          {!loading && (
            <p className="mt-3 text-gray-500 text-sm md:text-base">
              {items.length > 0
                ? `${items.length} item${
                    items.length !== 1 ? "s" : ""
                  } in your collection`
                : "Your favourites list is empty"}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : items.length > 0 ? (
          /* Product Grid */
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((product, index) => (
              <div
                key={product._id}
                className="transform transition duration-500 hover:scale-105 hover:-translate-y-2"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <ProductCard
                  product={product}
                  onRemove={handleRemove}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 px-6 bg-white/70 backdrop-blur-lg rounded-3xl shadow-lg border border-rose-100 text-center">
            
            <div className="text-7xl mb-6 animate-pulse">🤍</div>

            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
              No favourites yet
            </h2>

            <p className="text-gray-500 mb-8 max-w-md">
              Explore and heart the products you love. Your saved items will
              appear here for quick access.
            </p>

            <Link
              to="/"
              className="px-8 py-3 bg-rose-500 text-white rounded-full font-medium shadow-md hover:bg-rose-600 transition duration-300"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
