import { PicdropLogo } from './navbar'

export default function Footer() {
  return (
    <footer style={{
      background: '#13111F',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '48px 24px 36px',
      width: '100%'
    }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '32px', marginBottom: '40px' }}>
          <div>
            <div style={{ marginBottom: '12px' }}>
              <PicdropLogo size={20} />
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', maxWidth: '220px', lineHeight: 1.6 }}>
              Share your photos privately. No social media required.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>Product</div>
              {['Create a drop', 'Sign in', 'Pricing'].map(l => (
                <div key={l} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '8px', cursor: 'pointer' }}>{l}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>Company</div>
              {['About', 'Privacy', 'Terms', 'Contact'].map(l => (
                <div key={l} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '8px', cursor: 'pointer' }}>{l}</div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>© 2026 Picdrop.live — All rights reserved</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>Share moments, not your feed.</div>
        </div>
      </div>
    </footer>
  )
}