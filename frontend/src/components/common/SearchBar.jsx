import { useState, useEffect, useRef } from "react";

export default function SearchBar({ onSearch, initialValue = "" }) {
  const [val, setVal] = useState(initialValue);
  const [focused, setFocused] = useState(false);
  const debounce = useRef(null);

  useEffect(() => {
    setVal(initialValue);
  }, [initialValue]);

  const handleChange = (e) => {
    const v = e.target.value;
    setVal(v);

    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      onSearch(v);
    }, 380);
  };

  const clear = () => {
    setVal("");
    onSearch("");
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      
      {/* Search Icon */}
      <span
        className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg transition-colors duration-200 ${
          focused ? "text-indigo-600" : "text-gray-400"
        }`}
      >
        🔍
      </span>

      {/* Input */}
      <input
        type="text"
        value={val}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search products..."
        className={`w-full h-12 pl-12 pr-12 rounded-full border bg-white/70 backdrop-blur-md shadow-sm outline-none transition-all duration-300
          ${
            focused
              ? "border-indigo-500 ring-4 ring-indigo-100 shadow-md"
              : "border-gray-200 hover:border-gray-300"
          }`}
      />

      {/* Clear Button */}
      {val && (
        <button
          onClick={clear}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-all duration-200"
        >
          ✕
        </button>
      )}
    </div>
  );
}
