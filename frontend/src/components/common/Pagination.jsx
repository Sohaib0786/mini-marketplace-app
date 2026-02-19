export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null

  const pages = buildPages(currentPage, totalPages)

  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'center',
      gap:6, padding:'36px 0',
    }}>
      <PageBtn
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >←</PageBtn>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} style={{ color:'var(--text-3)', padding:'0 4px', userSelect:'none' }}>
            ···
          </span>
        ) : (
          <PageBtn
            key={p}
            active={p === currentPage}
            onClick={() => onPageChange(p)}
          >{p}</PageBtn>
        )
      )}

      <PageBtn
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >→</PageBtn>
    </div>
  )
}

function PageBtn({ onClick, disabled, active, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 38, height: 38, padding: '0 12px',
        borderRadius: 8,
        border: active ? 'none' : '1px solid var(--border)',
        background: active
          ? 'linear-gradient(135deg,#d4a853,#b8883a)'
          : 'var(--surface)',
        color: active ? '#080810' : disabled ? 'var(--text-3)' : 'var(--text-2)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: "'Outfit',sans-serif",
        fontWeight: active ? 700 : 400,
        fontSize: '.9rem',
        opacity: disabled ? .35 : 1,
        transition: 'all .18s',
        boxShadow: active ? 'var(--glow)' : 'none',
      }}
      onMouseEnter={e => {
        if (!active && !disabled) {
          e.currentTarget.style.borderColor = 'var(--gold-border)'
          e.currentTarget.style.color = 'var(--gold-light)'
        }
      }}
      onMouseLeave={e => {
        if (!active && !disabled) {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.color = 'var(--text-2)'
        }
      }}
    >
      {children}
    </button>
  )
}

function buildPages(cur, total) {
  const delta = 2
  const pages = []
  for (let i = Math.max(2, cur - delta); i <= Math.min(total - 1, cur + delta); i++) pages.push(i)
  if (cur - delta > 2)       pages.unshift('…')
  if (cur + delta < total - 1) pages.push('…')
  pages.unshift(1)
  if (total > 1) pages.push(total)
  return pages
}