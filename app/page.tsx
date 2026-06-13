'use client'
import Navbar from './navbar'
import HowStrip from './howstrip'
import UseCases from './useCases'
import Features from './features'
import Footer from './footer'

export default function Home() {
  const mockups = [
    {
      title: 'Team Offsite — Austin',
      caption: 'Three days, one great trip.',
      vibe: 'electric',
      slug: 'austin-offsite',
      days: 12,
      photos: [
        '/mockup-photos/photo6.jpg',
        '/mockup-photos/photo2.jpg',
        '/mockup-photos/photo7.jpg',
        '/mockup-photos/photo8.jpg',
        '/mockup-photos/photo10.jpg',
      ],
      bg: '#1C1830',
      accent: '#9B8FE4',
      tag: 'Work team'
    },
    {
      title: 'Sarah & James — June 7',
      caption: 'Thanks for celebrating with us.',
      vibe: 'clean',
      slug: 'sarah-james-wedding',
      days: 21,
      photos: [
        '/mockup-photos/photo4.jpg',
        '/mockup-photos/photo9.jpg',
        '/mockup-photos/photo11.jpg',
        '/mockup-photos/photo14.jpg',
      ],
      bg: '#F8F8F8',
      accent: '#333333',
      tag: 'Wedding'
    },
    {
      title: 'Miller Family Reunion',
      caption: 'Summer 2026 — the whole crew.',
      vibe: 'earthy',
      slug: 'miller-reunion-26',
      days: 7,
      photos: [
        '/mockup-photos/photo1.jpg',
        '/mockup-photos/photo3.jpg',
        '/mockup-photos/photo12.jpg',
      ],
      bg: '#1A2E1A',
      accent: '#7DBF7D',
      tag: 'Family'
    },
  ]

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

      {/* MOCKUP DROPS SECTION */}
      <div style={{ background: '#13111F', padding: '80px 24px', width: '100%' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#9B8FE4', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
              See it in action
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 3.5vw, 38px)', color: '#ffffff', lineHeight: 1.15 }}>
              What a drop looks like.
            </div>
            <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', marginTop: '12px', lineHeight: 1.6 }}>
              Every drop is a designed photo page — not a file link.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {mockups.map((m, mi) => (
              <div key={mi} style={{
                background: m.bg,
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
              }}
                onClick={() => window.location.href = '/create'}
              >
                {/* MOCK NAV */}
                <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${m.vibe === 'clean' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '14px', height: '14px', background: '#6040C8', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="9" height="9" viewBox="0 0 14 14" fill="none">
                        <rect x="1" y="1" width="5" height="5" rx="1" fill="white" opacity="0.95"/>
                        <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.6"/>
                        <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.6"/>
                        <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.3"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: m.vibe === 'clean' ? '#1C1830' : '#ffffff', letterSpacing: '-0.02em' }}>
                      pic<span style={{ color: m.accent }}>drop</span>
                    </span>
                  </div>
                  <div style={{ fontSize: '9px', color: m.vibe === 'clean' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
                    picdrop.live/drop/{m.slug}
                  </div>
                </div>

                {/* COVER PHOTO */}
                <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
                  <img src={m.photos[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.65) 100%)' }} />
                  <div style={{ position: 'absolute', bottom: '12px', left: '14px', right: '14px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#ffffff', marginBottom: '2px', letterSpacing: '-0.01em' }}>{m.title}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>{m.caption}</div>
                  </div>
                  {/* TAG */}
                  <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '9px', fontWeight: '600', padding: '3px 8px', borderRadius: '99px', background: 'rgba(0,0,0,0.4)', color: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)', letterSpacing: '0.04em' }}>
                    {m.tag}
                  </div>
                </div>

                {/* PHOTO GRID */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', padding: '2px' }}>
                  {m.photos.slice(1, 4).map((photo, pi) => (
                    <div key={pi} style={{ aspectRatio: '1', overflow: 'hidden' }}>
                      <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ))}
                </div>

                {/* MOCK FOOTER */}
                <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '10px', color: m.vibe === 'clean' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)' }}>
                    📷 {m.photos.length} photos
                  </div>
                  <div style={{ fontSize: '10px', color: m.vibe === 'clean' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)' }}>
                    ⏱ {m.days} days left
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button
              onClick={() => window.location.href = '/create'}
              style={{ background: '#6040C8', color: 'white', fontSize: '15px', fontWeight: '500', padding: '14px 36px', borderRadius: '10px', border: 'none', cursor: 'pointer', letterSpacing: '-0.01em' }}
            >
              Create your own drop
            </button>
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