'use client'
import { PicdropLogo } from '../navbar'

export default function Contact() {
  return (
    <div style={{ minHeight: '100vh', background: '#1C1830', fontFamily: 'sans-serif' }}>
      <nav style={{ background: 'rgba(28,24,48,0.96)', backdropFilter: 'blur(12px)', padding: '0 28px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 100 }}>
        <PicdropLogo />
        <button onClick={() => window.location.href = '/create'} style={{ background: '#6040C8', color: 'white', fontSize: '14px', fontWeight: '500', padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
          + New drop
        </button>
      </nav>

      <div style={{ maxWidth: '580px', margin: '0 auto', padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', fontWeight: '500', color: '#9B8FE4', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Contact</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px, 4vw, 42px)', color: '#ffffff', lineHeight: 1.15, marginBottom: '16px', letterSpacing: '-0.02em', fontWeight: '400' }}>
          Get in touch
        </h1>
        <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: '48px' }}>
          Have a question, found a bug, or just want to say hi? We'd love to hear from you.
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px', marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>Email us at</div>
          <div style={{ fontSize: '20px', color: '#9B8FE4', fontWeight: '500', letterSpacing: '-0.01em' }}>
            hello@picdrop.live
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)', marginTop: '8px' }}>
            We'll get back to you within 24 hours
          </div>
        </div>

        {[
          { title: 'Found a bug?', desc: 'Tell us exactly what happened and we\'ll fix it fast.' },
          { title: 'Feature request?', desc: 'We\'re actively building. Good ideas get built.' },
          { title: 'Something else?', desc: 'Just say hi. We\'re a small team and we read everything.' },
        ].map((item, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px 24px', marginBottom: '10px', textAlign: 'left' }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#ffffff', marginBottom: '4px' }}>{item.title}</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
        © 2026 Picdrop.live · <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => window.location.href = '/privacy'}>Privacy</span> · <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => window.location.href = '/terms'}>Terms</span>
      </footer>
    </div>
  )
}