export default function Footer() {
  return (
    <footer style={{
      background: '#1C1830',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      padding: '32px 24px',
      textAlign: 'center',
      width: '100%'
    }}>
      <div style={{
        fontFamily: 'Georgia, serif',
        fontSize: '18px',
        color: '#ffffff',
        marginBottom: '8px'
      }}>
        Pic<span style={{ color: '#9B8FE4', fontStyle: 'italic' }}>drop</span>
      </div>
      <div style={{
        fontSize: '13px',
        color: 'rgba(255,255,255,0.35)',
        marginBottom: '16px'
      }}>
        Share your photos, not your feed.
      </div>
      <div style={{
        display: 'flex',
        gap: '24px',
        justifyContent: 'center',
        fontSize: '13px',
        color: 'rgba(255,255,255,0.4)'
      }}>
        <span style={{ cursor: 'pointer' }}>About</span>
        <span style={{ cursor: 'pointer' }}>Privacy</span>
        <span style={{ cursor: 'pointer' }}>Terms</span>
        <span style={{ cursor: 'pointer' }}>Contact</span>
      </div>
      <div style={{
        fontSize: '12px',
        color: 'rgba(255,255,255,0.2)',
        marginTop: '16px'
      }}>
        © 2026 Picdrop.live — All rights reserved
      </div>
    </footer>
  )
}