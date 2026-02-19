import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function strength(p) {
  if (!p) return { score: 0, label: "", color: "bg-gray-200" };
  let s = 0;
  if (p.length >= 6) s++;
  if (p.length >= 10) s++;
  if (/\d/.test(p)) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[^a-zA-Z0-9]/.test(p)) s++;

  if (s <= 2) return { score: s, label: "Weak", color: "bg-red-500" };
  if (s <= 3) return { score: s, label: "Fair", color: "bg-yellow-500" };
  return { score: s, label: "Strong", color: "bg-green-500" };
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const change = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name || form.name.trim().length < 2)
      e.name = "Minimum 2 characters";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6)
      e.password = "Minimum 6 characters";
    else if (!/\d/.test(form.password))
      e.password = "Must include a number";
    if (form.password !== form.confirm)
      e.confirm = "Passwords do not match";
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setLoading(true);
    try {
      await register(
        form.name.trim(),
        form.email.trim().toLowerCase(),
        form.password
      );
      toast.success("Account created 🎉");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const pw = strength(form.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">

      <div className="w-full max-w-md backdrop-blur-xl bg-white/70 shadow-2xl rounded-3xl p-8 border border-white/40 animate-fade-in">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-2xl shadow-lg">
            ✨
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Create Account
          </h1>
          <p className="text-sm text-gray-500">
            Join our marketplace
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={change}
              placeholder="Jane Doe"
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-400 outline-none transition ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              name="email"
              value={form.email}
              onChange={change}
              placeholder="you@example.com"
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-400 outline-none transition ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>

            <div className="relative">
              <input
                name="password"
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={change}
                placeholder="Minimum 6 characters"
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-400 outline-none transition ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-4 top-3 text-gray-500 hover:text-indigo-600"
              >
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Strength bar */}
            {form.password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded transition-all duration-300 ${
                        i <= pw.score ? pw.color : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs mt-1 text-gray-600">
                  {pw.label} password
                </p>
              </div>
            )}

            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Confirm Password
            </label>
            <input
              name="confirm"
              type={showPw ? "text" : "password"}
              value={form.confirm}
              onChange={change}
              placeholder="Repeat your password"
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-400 outline-none transition ${
                errors.confirm
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {form.confirm &&
              form.password === form.confirm && (
                <p className="text-xs text-green-500 mt-1">
                  ✓ Passwords match
                </p>
              )}
            {errors.confirm && (
              <p className="text-xs text-red-500 mt-1">
                {errors.confirm}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70"
          >
            {loading ? "Creating..." : "Create Account →"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
