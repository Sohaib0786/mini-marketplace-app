export function ProductSkeleton() {
  return (
    <div className="card" style={{ overflow:'hidden' }}>
      <div className="skeleton" style={{ height:210, borderRadius:0 }} />
      <div style={{ padding:18, display:'flex', flexDirection:'column', gap:10 }}>
        <div className="skeleton" style={{ height:14, width:'70%' }} />
        <div className="skeleton" style={{ height:11, width:'45%' }} />
        <div className="skeleton" style={{ height:11, width:'90%' }} />
        <div className="skeleton" style={{ height:11, width:'65%' }} />
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
          <div className="skeleton" style={{ height:22, width:70 }} />
          <div className="skeleton" style={{ height:14, width:55 }} />
        </div>
      </div>
    </div>
  )
}

export function TextSkeleton({ w = '100%', h = 14 }) {
  return <div className="skeleton" style={{ height: h, width: w }} />
}