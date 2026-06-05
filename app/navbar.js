'use client'
export default function Navbar() {
  return (
    <nav style={{
      background: '#1C1830',
      padding: '0 28px',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div onClick={() => window.location.href = '/'} style={{
        fontFamily: 'Georgia, serif',
        fontSize: '21px',
        color: '#ffffff',
        cursor: 'pointer',
        letterSpacing: '-0.02em'
      }}>
        Pic<span style={{ color: '#9B8FE4', fontStyle: 'italic' }}>drop</span>
      </div>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <div onClick={() => window.location.href = '/login'} style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.6)',
          cursor: 'pointer',
          padding: '6px 12px',
          borderRadius: '9px'
        }}>
          Sign in
        </div>
        <button onClick={() => window.location.href = '/create'} style={{
          background: '#6040C8',
          color: 'white',
          fontSize: '13px',
          fontWeight: '500',
          padding: '8px 18px',
          borderRadius: '9px',
          border: 'none',
          cursor: 'pointer'
        }}>
          + New drop
        </button>
      </div>
    </nav>
  )
}