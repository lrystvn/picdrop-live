'use client'
const PicdropLogo = ({ size = 22 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '9px', cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
    <div style={{ width: size, height: size, background: '#6040C8', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 14 14" fill="none">
        <rect x="1" y="1" width="5" height="5" rx="1" fill="white" opacity="0.95"/>
        <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.6"/>
        <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.6"/>
        <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.3"/>
      </svg>
    </div>
    <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: size, fontWeight: '600', color: '#ffffff', letterSpacing: '-0.04em', lineHeight: 1 }}>
      pic<span style={{ color: '#9B8FE4' }}>drop</span>
    </span>
  </div>
)

export { PicdropLogo }

export default function Navbar() {
  return (
    <nav style={{
      background: 'rgba(28,24,48,0.92)',
      backdropFilter: 'blur(12px)',
      padding: '0 28px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <PicdropLogo size={22} />
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <div onClick={() => window.location.href = '/login'} style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', padding: '7px 14px', borderRadius: '8px' }}>
          Sign in
        </div>
        <button onClick={() => window.location.href = '/create'} style={{ background: '#6040C8', color: 'white', fontSize: '14px', fontWeight: '500', padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', letterSpacing: '-0.01em' }}>
          + New drop
        </button>
      </div>
    </nav>
  )
}