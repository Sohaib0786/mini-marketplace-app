import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'

import Navbar          from './components/layout/Navbar'
import HomePage        from './pages/HomePage'
import LoginPage       from './pages/LoginPage'
import RegisterPage    from './pages/RegisterPage'
import ProductDetailPage from './pages/ProductDetailPage'
import FavoritesPage   from './pages/FavoritesPage'
import ProfilePage     from './pages/ProfilePage'

/* ── Route guards ─────────────────────────────────────── */
function Private({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function PublicOnly({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  return !isAuthenticated ? children : <Navigate to="/" replace />
}

/* ── App shell ────────────────────────────────────────── */
function Shell() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* atmospheric orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <Navbar />

      <main style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/"           element={<HomePage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />

          <Route path="/login"    element={<PublicOnly><LoginPage /></PublicOnly>} />
          <Route path="/register" element={<PublicOnly><RegisterPage /></PublicOnly>} />

          <Route path="/favorites" element={<Private><FavoritesPage /></Private>} />
          <Route path="/profile"   element={<Private><ProfilePage /></Private>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3200,
          style: {
            background: '#1a1a2e',
            color: '#f2f0eb',
            border: '1px solid rgba(212,168,83,.28)',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '.88rem',
            borderRadius: '10px',
            boxShadow: '0 8px 32px rgba(0,0,0,.5)',
          },
          success: { iconTheme: { primary: '#d4a853', secondary: '#080810' } },
          error:   { iconTheme: { primary: '#f06a6a', secondary: '#080810' } },
        }}
      />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </BrowserRouter>
  )
}