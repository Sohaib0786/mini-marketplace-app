import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout, isAuthenticated, favorites } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const fn = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const active = (p) => location.pathname === p;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-md"
          : "bg-white/50 backdrop-blur-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
            🛍️
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Micro Market
          </span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          <NavItem to="/" active={active("/")}>
            Explore
          </NavItem>

          {isAuthenticated ? (
            <>
              <NavItem to="/favorites" active={active("/favorites")}>
                Saved
                {favorites.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full">
                    {favorites.length}
                  </span>
                )}
              </NavItem>

              {/* Avatar Dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center text-sm font-bold">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <span className="text-xs text-gray-400">
                    {open ? "▲" : "▼"}
                  </span>
                </button>

                {open && (
                  <div className="absolute right-0 mt-3 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in">
                    <DropdownItem to="/profile">
                      👤 Profile
                    </DropdownItem>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                    >
                      🚪 Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                Join Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

/* NavItem Component */
function NavItem({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-indigo-100 text-indigo-600"
          : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600"
      }`}
    >
      {children}
    </Link>
  );
}

/* DropdownItem */
function DropdownItem({ to, children }) {
  return (
    <Link
      to={to}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
    >
      {children}
    </Link>
  );
}
