export default function Stars({ rating = 0, numReviews, size = "text-sm" }) {
  const rounded = Math.round(rating);

  return (
    <div className="flex items-center gap-2">
      
      {/* Stars */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`
              ${size}
              transition-all duration-200
              ${i <= rounded
                ? "text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.6)]"
                : "text-gray-300"}
            `}
          >
            ★
          </span>
        ))}
      </div>

      {/* Rating number (optional improvement) */}
      <span className="text-xs font-medium text-gray-600">
        {rating.toFixed(1)}
      </span>

      {/* Review count */}
      {numReviews != null && (
        <span className="text-xs text-gray-500">
          ({numReviews.toLocaleString()})
        </span>
      )}
    </div>
  );
}
