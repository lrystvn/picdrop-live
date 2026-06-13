'use client'
import { PicdropLogo } from '../navbar'

export default function Pricing() {
  return (
    <div style={{ minHeight: '100vh', background: '#1C1830', fontFamily: 'var(--font-inter)' }}>
      <nav style={{ background: 'rgba(28,24,48,0.96)', backdropFilter: 'blur(12px)', padding: '0 28px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 100 }}>
        <PicdropLogo />
        <button onClick={() => window.location.href = '/create'} style={{ background: '#6040C8', color: 'white', fontSize: '14px', fontWeight: '500', padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
          + New drop
        </button>
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', fontWeight: '500', color: '#9B8FE4', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Pricing</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 5vw, 48px)', color: '#ffffff', lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-0.02em', fontWeight: '400' }}>
          Free while we're in beta.
        </h1>
        <div style={{ fontSize: '17px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: '56px', maxWidth: '480px', margin: '0 auto 56px' }}>
          Picdrop is completely free to use right now. We're still building and refining — your feedback helps shape what comes next.
        </div>

        {/* FREE PLAN */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(155,143,228,0.3)', borderRadius: '18px', padding: '40px 36px', marginBottom: '16px', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '22px', fontWeight: '600', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '4px' }}>Free</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>Everything included, no card required</div>
            </div>
            <div style={{ fontSize: '11px', fontWeight: '600', padding: '5px 12px', borderRadius: '99px', background: 'rgba(155,143,228,0.2)', color: '#9B8FE4', border: '1px solid rgba(155,143,228,0.3)', letterSpacing: '0.05em' }}>
              CURRENT PLAN
            </div>
          </div>
          {[
            'Unlimited drops',
            'Up to 50 photos per drop',
            '7, 14, or 30 day expiry',
            'Custom slug for every drop',
            '6 vibe themes',
            'Password protection',
            'Photo captions',
            'No account required to view',
          ].map((feature, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(155,143,228,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '10px', color: '#9B8FE4' }}>✓</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)' }}>{feature}</div>
            </div>
          ))}
          <button onClick={() => window.location.href = '/create'} style={{ width: '100%', background: '#6040C8', color: 'white', fontSize: '15px', fontWeight: '500', padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer', marginTop: '24px' }}>
            Start for free
          </button>
        </div>

        {/* PRO TEASER */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', padding: '32px 36px', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '22px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', letterSpacing: '-0.02em', marginBottom: '4px' }}>Pro</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.25)' }}>Coming soon</div>
            </div>
            <div style={{ fontSize: '11px', fontWeight: '600', padding: '5px 12px', borderRadius: '99px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)', letterSpacing: '0.05em' }}>
              COMING SOON
            </div>
          </div>
          {[
            'Everything in Free',
            'Video support',
            'Custom domain',
            'Analytics dashboard',
            'Longer expiry options',
            'Priority support',
          ].map((feature, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>✓</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)' }}>{feature}</div>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
        © 2026 Picdrop.live · <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => window.location.href = '/privacy'}>Privacy</span> · <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => window.location.href = '/terms'}>Terms</span>
      </footer>
    </div>
  )
}