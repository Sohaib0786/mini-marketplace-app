import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
})

// ── Attach token ───────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mm_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Handle 401 ─────────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mm_token')
      localStorage.removeItem('mm_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ───────────────────────────────────────────────
export const authAPI = {
  register: (data)        => api.post('/auth/register', data),
  login:    (data)        => api.post('/auth/login', data),
  getMe:    ()            => api.get('/auth/me'),
  updateMe: (data)        => api.put('/auth/me', data),
}

// ── Products ───────────────────────────────────────────
export const productsAPI = {
  getAll:        (params) => api.get('/products', { params }),
  getOne:        (id)     => api.get(`/products/${id}`),
  getCategories: ()       => api.get('/products/categories'),
  create:        (form)   => api.post('/products', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update:        (id, form) => api.put(`/products/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete:        (id)     => api.delete(`/products/${id}`),
}

// ── Favorites ──────────────────────────────────────────
export const favoritesAPI = {
  getAll: ()          => api.get('/favorites'),
  add:    (pid)       => api.post(`/favorites/${pid}`),
  remove: (pid)       => api.delete(`/favorites/${pid}`),
  toggle: (pid)       => api.post(`/favorites/${pid}/toggle`),
}

export default api