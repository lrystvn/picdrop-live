'use client'
import { PicdropLogo } from '../navbar'

export default function About() {
  return (
    <div style={{ minHeight: '100vh', background: '#1C1830', fontFamily: 'var(--font-inter)' }}>
      <nav style={{ background: 'rgba(28,24,48,0.96)', backdropFilter: 'blur(12px)', padding: '0 28px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 100 }}>
        <PicdropLogo />
        <button onClick={() => window.location.href = '/create'} style={{ background: '#6040C8', color: 'white', fontSize: '14px', fontWeight: '500', padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
          + New drop
        </button>
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ fontSize: '11px', fontWeight: '500', color: '#9B8FE4', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>About</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 5vw, 48px)', color: '#ffffff', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.02em', fontWeight: '400' }}>
          Built for one simple problem.
        </h1>

        <div style={{ fontSize: '18px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, marginBottom: '32px' }}>
          My fiancée and I took a trip together. When we got back, I wanted to share the photos with my remote team — people I work with every day but rarely get to connect with personally.
        </div>

        <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: '24px' }}>
          The options were terrible. I could post on social media — but not everyone is on the same platforms, and honestly not everything needs to be public. I could send a Google Drive link — but that felt clunky and impersonal. I could spam the group chat with 30 photos — but that's just noise.
        </div>

        <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: '24px' }}>
          What I wanted was simple: a clean, private page with my photos, a link I could drop in Slack, and something that would disappear once it had served its purpose. No accounts required to view. No social media. No clutter.
        </div>

        <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: '48px' }}>
          So I built Picdrop. A custom photo page in seconds. Share the link privately. It disappears automatically.
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '40px' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: '#ffffff', marginBottom: '16px' }}>What makes it different</div>
          {[
            { title: 'It\'s a page, not a file dump', desc: 'Every drop is a designed photo page with your own vibe, layout, and link. It looks intentional because it is.' },
            { title: 'Private by default', desc: 'No one stumbles across your photos. You share the link with exactly who you want.' },
            { title: 'It disappears', desc: 'Set an expiry and the link goes dead automatically. No digital clutter, no old links floating around forever.' },
            { title: 'No account to view', desc: 'The people you share with just click the link. That\'s it. No sign-up required.' },
          ].map((item, i) => (
            <div key={i} style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '15px', fontWeight: '500', color: '#ffffff', marginBottom: '6px' }}>{item.title}</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>Ready to share your photos the right way?</div>
          <button onClick={() => window.location.href = '/create'} style={{ background: '#6040C8', color: 'white', fontSize: '15px', fontWeight: '500', padding: '14px 32px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
            Create your first drop
          </button>
        </div>
      </div>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
        © 2026 Picdrop.live · <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => window.location.href = '/privacy'}>Privacy</span> · <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => window.location.href = '/terms'}>Terms</span>
      </footer>
    </div>
  )
}