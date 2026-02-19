import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const change = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const submit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) {
      setErrors(e)
      return
    }

    setLoading(true)
    try {
      await login(form.email.trim().toLowerCase(), form.password)
      toast.success('Welcome back 👋')
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      toast.error(msg)
      if (/password/i.test(msg)) setErrors({ password: 'Incorrect password' })
      else if (/email/i.test(msg)) setErrors({ email: 'Email not found' })
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (email) => {
    setForm({ email, password: 'password123' })
    setErrors({})
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white text-2xl shadow-lg">
            🔐
          </div>
          <h1 className="text-3xl font-semibold text-gray-800">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to your account
          </p>
        </div>

        {/* Demo Accounts */}
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-3">
            Quick Demo Login
          </p>

          <div className="flex gap-3 mb-2">
            {[
              { label: '👑 Admin', email: 'alice@marketplace.com' },
              { label: '👤 User', email: 'bob@marketplace.com' },
            ].map((d) => (
              <button
                key={d.email}
                onClick={() => fillDemo(d.email)}
                className="flex-1 py-2 text-sm font-medium rounded-lg bg-white border border-amber-200 hover:bg-amber-100 transition"
              >
                {d.label}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-500">
            Password: <span className="font-mono">password123</span>
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={submit}
          className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-8 space-y-5"
        >
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={change}
              placeholder="you@example.com"
              autoComplete="email"
              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition
                ${
                  errors.email
                    ? 'border-red-400 focus:ring-red-300'
                    : 'border-gray-300 focus:ring-amber-400'
                }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                ⚠ {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={change}
                placeholder="Your password"
                autoComplete="current-password"
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition pr-12
                  ${
                    errors.password
                      ? 'border-red-400 focus:ring-red-300'
                      : 'border-gray-300 focus:ring-amber-400'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                ⚠ {errors.password}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-md hover:shadow-lg transition disabled:opacity-70"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in…
              </>
            ) : (
              'Sign In →'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-gray-500">
          No account?{' '}
          <Link
            to="/register"
            className="text-amber-600 font-semibold hover:underline"
          >
            Create one →
          </Link>
        </p>
      </div>
    </div>
  )
}
