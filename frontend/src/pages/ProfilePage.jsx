import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, favorites, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim() || name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

    setSaving(true);
    try {
      await authAPI.updateMe({ name: name.trim() });
      toast.success("Profile updated!");
      setEditing(false);
    } catch {
      toast.error("Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    setEditing(false);
    setName(user?.name || "");
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?";

  const since = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-16 px-4">
      <div className="max-w-xl mx-auto">

        {/* ───────────── Title ───────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center">
          My <span className="text-indigo-600">Profile</span>
        </h1>

        {/* ───────────── Profile Card ───────────── */}
        <div className="bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden border border-gray-100">

          {/* Banner */}
          <div className="h-28 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500" />

          <div className="px-8 pb-8 -mt-14">

            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white">
              {initials}
            </div>

            {/* Name Section */}
            <div className="mt-6">
              {editing ? (
                <div className="flex flex-wrap gap-3 items-center">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={save}
                    disabled={saving}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={cancel}
                    className="px-4 py-2 border rounded-xl hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-semibold">
                    {user?.name}
                  </h2>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Edit
                  </button>
                </div>
              )}

              <p className="text-gray-500 mt-1">{user?.email}</p>

              {user?.role === "admin" && (
                <span className="inline-block mt-3 px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full">
                  👑 Admin
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <StatCard icon="❤️" value={favorites.length} label="Favorites" />
              <StatCard icon="📅" value={since} label="Joined" small />
              <StatCard
                icon="👤"
                value={user?.role === "admin" ? "Admin" : "Member"}
                label="Account"
              />
            </div>
          </div>
        </div>

        {/* ───────────── Danger Zone ───────────── */}
        <div className="mt-10 bg-red-50 border border-red-200 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wide mb-4">
            Account Actions
          </h3>
          <button
            onClick={logout}
            className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition shadow"
          >
            🚪 Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Reusable Stat Card ───────────── */
function StatCard({ icon, value, label, small }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 text-center hover:shadow-lg transition">
      <div className="text-2xl mb-2">{icon}</div>
      <div
        className={`font-semibold ${
          small ? "text-sm text-gray-600" : "text-lg text-indigo-600"
        }`}
      >
        {value}
      </div>
      <div className="text-xs text-gray-400 uppercase tracking-wide mt-1">
        {label}
      </div>
    </div>
  );
}
