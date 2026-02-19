import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { productsAPI, favoritesAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Stars from '../components/common/Stars'
import { TextSkeleton } from '../components/common/Skeleton'

export default function ProductDetailPage() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const { isAuthenticated, isFavorited, toggleFavorite } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [imgErr, setImgErr]   = useState(false)
  const [imgOk, setImgOk]     = useState(false)
  const [favLoad, setFavLoad] = useState(false)
  const [qty, setQty]         = useState(1)
  const [added, setAdded]     = useState(false)

  const faved = product ? isFavorited(product._id) : false

  useEffect(() => {
    productsAPI.getOne(id)
      .then(({ data }) => setProduct(data.data.product))
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleFav = async () => {
    if (!isAuthenticated) { toast.error('Sign in to save favourites'); navigate('/login'); return }
    if (favLoad) return
    setFavLoad(true)
    try {
      await favoritesAPI.toggle(product._id)
      toggleFavorite(product._id)
      toast.success(faved ? 'Removed from saved' : '❤️ Saved!')
    } catch { toast.error('Something went wrong') }
    finally { setFavLoad(false) }
  }

  const handleCart = () => {
    if (!isAuthenticated) { toast.error('Sign in first'); return }
    setAdded(true)
    toast.success(`Added ${qty} × "${product.title}" 🛒`)
    setTimeout(() => setAdded(false), 2200)
  }

  /* ── loading skeleton ─────────────────────────────── */
  if (loading) return (
    <div className="container page">
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'start' }}>
        <div className="skeleton" style={{ height:440, borderRadius:'var(--radius-xl)' }}/>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <TextSkeleton w="80%" h={36}/>
          <TextSkeleton w="50%" h={18}/>
          <TextSkeleton w="100%"/>
          <TextSkeleton w="75%"/>
        </div>
      </div>
    </div>
  )

  /* ── error ────────────────────────────────────────── */
  if (error || !product) return (
    <div className="container page" style={{ textAlign:'center' }}>
      <p style={{ fontSize:'4rem', marginBottom:20 }}>😕</p>
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", marginBottom:8 }}>{error || 'Not found'}</h2>
      <Link to="/" className="btn btn-primary" style={{ marginTop:20 }}>Back to products</Link>
    </div>
  )

  const placeholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.title)}&size=600&background=1a1a2e&color=d4a853&bold=true&length=2`

  return (
    <div className="container page">

      {/* breadcrumb */}
      <nav style={{
        display:'flex', gap:8, alignItems:'center',
        fontSize:'.84rem', color:'var(--text-3)', marginBottom:32,
      }}>
        <Link to="/" style={{ color:'var(--text-3)' }}
          onMouseEnter={e=>e.target.style.color='var(--gold)'}
          onMouseLeave={e=>e.target.style.color='var(--text-3)'}
        >Home</Link>
        <span>›</span>
        <span style={{ color:'var(--gold)' }}>{product.category}</span>
        <span>›</span>
        <span style={{ maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {product.title}
        </span>
      </nav>

      <div style={{
        display:'grid',
        gridTemplateColumns:'minmax(300px,1fr) minmax(320px,1fr)',
        gap:52, alignItems:'start',
      }} className="detail-grid">

        {/* ── Image col ────────────────────────────── */}
        <div>
          <div style={{
            borderRadius:'var(--radius-xl)', overflow:'hidden',
            background:'var(--surface)', border:'1px solid var(--border)',
            aspectRatio:'1', position:'relative', boxShadow:'var(--shadow-l)',
          }}>
            {!imgOk && <div className="skeleton" style={{ position:'absolute', inset:0 }}/>}
            <img
              src={imgErr ? placeholder : (product.image || placeholder)}
              alt={product.title}
              onError={() => setImgErr(true)}
              onLoad={()  => setImgOk(true)}
              style={{
                width:'100%', height:'100%', objectFit:'cover',
                opacity: imgOk ? 1 : 0,
                transition:'opacity .4s',
              }}
            />
          </div>

          {product.tags?.length > 0 && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginTop:14 }}>
              {product.tags.map(t => (
                <span key={t} style={{
                  padding:'3px 12px', borderRadius:50,
                  background:'var(--surface-2)', border:'1px solid var(--border)',
                  fontSize:'.76rem', color:'var(--text-3)',
                }}>#{t}</span>
              ))}
            </div>
          )}
        </div>

        {/* ── Info col ─────────────────────────────── */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

          {/* badges */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <span className="badge badge-gold">{product.category}</span>
            {product.stock > 0
              ? <span className="badge badge-green">{product.stock} in stock</span>
              : <span className="badge badge-red">Out of stock</span>
            }
          </div>

          <h1 style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:'clamp(1.6rem,3.5vw,2.2rem)',
            fontWeight:700, lineHeight:1.18,
          }}>{product.title}</h1>

          <Stars rating={product.rating} numReviews={product.numReviews} size="1.1rem"/>

          {/* price */}
          <div style={{
            padding:'16px 18px',
            background:'var(--surface)', borderRadius:'var(--radius-m)',
            border:'1px solid var(--gold-border)',
          }}>
            <span style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:'2.4rem', fontWeight:700,
              color:'var(--gold)', letterSpacing:'-.02em',
            }}>${product.price?.toFixed(2)}</span>
          </div>

          {/* description */}
          <div>
            <p className="section-label">Description</p>
            <p style={{ color:'var(--text-2)', lineHeight:1.75, fontSize:'.95rem' }}>
              {product.description}
            </p>
          </div>

          {/* seller */}
          {product.seller && (
            <div style={{
              display:'flex', alignItems:'center', gap:12,
              padding:'12px 16px', background:'var(--surface)',
              borderRadius:'var(--radius-s)', border:'1px solid var(--border)',
            }}>
              <div style={{
                width:34, height:34, borderRadius:'50%',
                background:'linear-gradient(135deg,#d4a853,#b8883a)',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'#080810', fontWeight:700, fontSize:'.88rem',
              }}>{product.seller.name?.[0]?.toUpperCase()}</div>
              <div>
                <p style={{ fontSize:'.74rem', color:'var(--text-3)' }}>Sold by</p>
                <p style={{ fontSize:'.92rem', fontWeight:500 }}>{product.seller.name}</p>
              </div>
            </div>
          )}

          {/* qty selector */}
          {product.stock > 0 && (
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ fontSize:'.85rem', color:'var(--text-2)' }}>Qty:</span>
              <div style={{
                display:'flex', border:'1px solid var(--border)',
                borderRadius:'var(--radius-s)', overflow:'hidden',
              }}>
                {[
                  { label:'−', action:() => setQty(q => Math.max(1, q-1)) },
                  { label:qty, action:null },
                  { label:'+', action:() => setQty(q => Math.min(product.stock, q+1)) },
                ].map(({ label, action }, i) => (
                  <button key={i} onClick={action} style={{
                    padding:'8px 16px', background: action ? 'var(--surface-2)' : 'var(--surface)',
                    border:'none', cursor: action ? 'pointer' : 'default',
                    color:'var(--text-1)', fontFamily:"'Outfit',sans-serif",
                    fontWeight: !action ? 600 : 400, fontSize:'.95rem',
                    minWidth: !action ? 38 : 'auto', textAlign:'center',
                    transition:'background .18s',
                  }}
                  onMouseEnter={e => { if(action) e.currentTarget.style.background='var(--surface-3)' }}
                  onMouseLeave={e => { if(action) e.currentTarget.style.background='var(--surface-2)' }}
                  >{label}</button>
                ))}
              </div>
            </div>
          )}

          {/* CTAs */}
          <div style={{ display:'flex', gap:12 }}>
            <button
              onClick={handleCart}
              disabled={product.stock === 0}
              className="btn btn-primary"
              style={{
                flex:1, height:50, fontSize:'1rem',
                transition:'all .22s',
              }}
            >
              {added ? '✓ Added!' : product.stock === 0 ? 'Out of stock' : '🛒 Add to cart'}
            </button>

            <button
              onClick={handleFav}
              disabled={favLoad}
              className="btn"
              style={{
                height:50, padding:'0 20px', fontSize:'1.3rem',
                background: faved ? 'rgba(240,106,106,.14)' : 'var(--surface-2)',
                border:`1px solid ${faved ? 'rgba(240,106,106,.4)' : 'var(--border)'}`,
                color: faved ? 'var(--danger)' : 'var(--text-2)',
                transition:'all .22s',
                transform: favLoad ? 'scale(.92)' : 'scale(1)',
              }}
              aria-label="Toggle favourite"
            >{faved ? '♥' : '♡'}</button>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          .detail-grid{ grid-template-columns:1fr !important; gap:28px !important; }
        }
      `}</style>
    </div>
  )
}