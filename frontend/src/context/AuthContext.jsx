import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(null)
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading]     = useState(true)

  /* ── Bootstrap ─────────────────────────────────────── */
  useEffect(() => {
    const init = async () => {
      const token   = localStorage.getItem('mm_token')
      const saved   = localStorage.getItem('mm_user')
      if (!token || !saved) { setLoading(false); return }

      try {
        setUser(JSON.parse(saved))
        const { data } = await authAPI.getMe()
        const fresh = data.data.user
        setUser(fresh)
        setFavorites(normFavs(fresh.favorites))
        localStorage.setItem('mm_user', JSON.stringify(fresh))
      } catch {
        localStorage.removeItem('mm_token')
        localStorage.removeItem('mm_user')
        setUser(null)
        setFavorites([])
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const normFavs = (favs = []) =>
    favs.map(f => (typeof f === 'string' ? f : f._id))

  /* ── Login / Register / Logout ─────────────────────── */
  const login = useCallback(async (email, password) => {
    const { data } = await authAPI.login({ email, password })
    const { token, user: u } = data.data
    localStorage.setItem('mm_token', token)
    localStorage.setItem('mm_user', JSON.stringify(u))
    setUser(u)
    setFavorites(normFavs(u.favorites))
    return u
  }, [])

  const register = useCallback(async (name, email, password) => {
    const { data } = await authAPI.register({ name, email, password })
    const { token, user: u } = data.data
    localStorage.setItem('mm_token', token)
    localStorage.setItem('mm_user', JSON.stringify(u))
    setUser(u)
    setFavorites([])
    return u
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('mm_token')
    localStorage.removeItem('mm_user')
    setUser(null)
    setFavorites([])
    toast.success('Signed out successfully')
  }, [])

  /* ── Favorites helpers ─────────────────────────────── */
  const toggleFavorite = useCallback((pid) => {
    setFavorites(prev =>
      prev.includes(pid) ? prev.filter(id => id !== pid) : [...prev, pid]
    )
  }, [])

  const isFavorited = useCallback(
    (pid) => favorites.includes(pid),
    [favorites]
  )

  return (
    <AuthContext.Provider value={{
      user, loading, favorites,
      login, register, logout,
      toggleFavorite, isFavorited,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}