import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { favoritesAPI } from '../../services/api'
import Stars from '../common/Stars'

export default function ProductCard({ product, onRemove }) {
  const { isAuthenticated, isFavorited, toggleFavorite } = useAuth()
  const [favLoading, setFavLoading] = useState(false)
  const [bounce, setBounce] = useState(false)
  const [imgErr, setImgErr] = useState(false)

  const faved = isFavorited(product._id)

  const placeholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    product.title
  )}&size=400&background=1e1b2e&color=ffffff&bold=true&length=2`

  const handleFav = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      toast.error('Sign in to save favourites')
      return
    }

    if (favLoading) return

    setFavLoading(true)
    setBounce(true)
    setTimeout(() => setBounce(false), 400)

    try {
      await favoritesAPI.toggle(product._id)
      toggleFavorite(product._id)
      if (onRemove && faved) onRemove(product._id)
      toast.success(faved ? 'Removed from saved' : '❤️ Saved!')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setFavLoading(false)
    }
  }

  return (
    <Link to={`/products/${product._id}`} className="group block">
      <article className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-md border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300">

        {/* Image Section */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={imgErr ? placeholder : product.image || placeholder}
            alt={product.title}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

          {/* Category Badge */}
          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-amber-500 text-white shadow">
            {product.category}
          </span>

          {/* Heart Button */}
          <button
            onClick={handleFav}
            disabled={favLoading}
            className={`absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-300
              ${
                faved
                  ? 'bg-red-500 text-white shadow-lg scale-105'
                  : 'bg-white/70 text-gray-700 hover:bg-red-100'
              }
              ${bounce ? 'animate-bounce scale-125' : ''}
            `}
            aria-label={faved ? 'Remove from saved' : 'Save product'}
          >
            {faved ? '♥' : '♡'}
          </button>

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-full shadow-lg">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-5 space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-amber-600 transition-colors">
            {product.title}
          </h3>

          <Stars rating={product.rating} numReviews={product.numReviews} />

          <p className="text-sm text-gray-500 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <span className="text-2xl font-bold text-amber-600">
              ${product.price?.toFixed(2)}
            </span>

            <span
              className={`flex items-center gap-2 text-xs font-medium ${
                product.stock > 0 ? 'text-green-600' : 'text-red-500'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  product.stock > 0 ? 'bg-green-600' : 'bg-red-500'
                }`}
              />
              {product.stock > 0
                ? `${product.stock} left`
                : 'Sold out'}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
