'use client'
import Navbar from './navbar'
import HowStrip from './howstrip'
import UseCases from './useCases'
import Features from './features'
import Footer from './footer'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#1C1830', fontFamily: 'var(--font-inter)' }}>
      <Navbar />

      {/* HERO */}
      <div style={{ background: '#1C1830', padding: '96px 24px 80px', textAlign: 'center' }}>
        <div style={{ maxWidth: '740px', margin: '0 auto' }}>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '12px', fontWeight: '500', color: '#9B8FE4',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: '28px', border: '1px solid rgba(155,143,228,0.35)',
            padding: '5px 14px', borderRadius: '99px'
          }}>
            <span style={{ width: '6px', height: '6px', background: '#9B8FE4', borderRadius: '50%', display: 'inline-block' }} />
            Private photo sharing
          </div>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(38px, 5.5vw, 64px)',
            color: '#ffffff',
            lineHeight: 1.08,
            marginBottom: '22px',
            letterSpacing: '-0.02em',
            fontWeight: '400'
          }}>
            Share your photos with<br />
            <em style={{ color: '#9B8FE4' }}>the right people, instantly.</em>
          </h1>

          <p style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.75,
            marginBottom: '16px',
            maxWidth: '520px',
            margin: '0 auto 16px'
          }}>
            Create a custom photo page in seconds — your vibe, your layout, your link.
            Share it privately. It disappears automatically.
          </p>

          <p style={{
            fontSize: '15px',
            color: 'rgba(255,255,255,0.35)',
            lineHeight: 1.7,
            marginBottom: '40px',
            maxWidth: '480px',
            margin: '0 auto 40px'
          }}>
            No cloud folders. No social media post. No group chat chaos.
            Just a link that works for the people who matter.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
            <button
              onClick={() => window.location.href = '/create'}
              style={{
                background: '#6040C8', color: 'white', fontSize: '15px',
                fontWeight: '500', padding: '14px 32px', borderRadius: '10px',
                border: 'none', cursor: 'pointer', letterSpacing: '-0.01em'
              }}
            >
              Create a photo drop
            </button>
            <button
              onClick={() => window.location.href = '/login'}
              style={{
                background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.75)',
                fontSize: '15px', padding: '14px 28px', borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer'
              }}
            >
              Sign in
            </button>
          </div>

          {/* FEATURE LINE */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '6px', flexWrap: 'wrap', marginBottom: '64px'
          }}>
            {[
              'Custom photo page',
              'Your own link',
              'Auto-expires',
              'No account to view'
            ].map((item, i, arr) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{item}</span>
                {i < arr.length - 1 && (
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.15)' }}>·</span>
                )}
              </div>
            ))}
          </div>

          {/* STATS */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '40px', flexWrap: 'wrap',
            paddingTop: '32px',
            borderTop: '1px solid rgba(255,255,255,0.06)'
          }}>
            {[
              { val: '30 days', label: 'max link life' },
              { val: '50 photos', label: 'per drop' },
              { val: '0', label: 'social accounts needed to view' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: '500', color: '#ffffff', fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em' }}>{s.val}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '3px', letterSpacing: '0.02em' }}>{s.label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <HowStrip />
      <UseCases />
      <Features />
      <Footer />
    </div>
  )
}