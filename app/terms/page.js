'use client'
import { PicdropLogo } from '../navbar'

export default function Terms() {
  return (
    <div style={{ minHeight: '100vh', background: '#1C1830', fontFamily: 'var(--font-inter)' }}>
      <nav style={{ background: 'rgba(28,24,48,0.96)', backdropFilter: 'blur(12px)', padding: '0 28px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 100 }}>
        <PicdropLogo />
        <button onClick={() => window.location.href = '/create'} style={{ background: '#6040C8', color: 'white', fontSize: '14px', fontWeight: '500', padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
          + New drop
        </button>
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ fontSize: '11px', fontWeight: '500', color: '#9B8FE4', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Terms of Service</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4vw, 42px)', color: '#ffffff', lineHeight: 1.15, marginBottom: '12px', letterSpacing: '-0.02em', fontWeight: '400' }}>
          Simple terms, plain English.
        </h1>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginBottom: '48px' }}>Last updated June 2026</div>

        {[
          {
            title: 'Using Picdrop',
            body: 'Picdrop is a private photo sharing service. You must be 18 or older to create an account. By using Picdrop you agree to these terms.'
          },
          {
            title: 'Your content',
            body: 'You own the photos you upload. By uploading them you give us permission to store and display them to people with your drop link. You are responsible for ensuring you have the right to share any photos you upload.'
          },
          {
            title: 'What you cannot upload',
            body: 'You may not upload illegal content, content that violates anyone\'s privacy, sexually explicit content involving minors, or content that harasses or threatens anyone. Violations will result in immediate account termination and may be reported to authorities.'
          },
          {
            title: 'Service availability',
            body: 'We aim to keep Picdrop available at all times but cannot guarantee 100% uptime. We are not liable for any loss of data or service interruptions.'
          },
          {
            title: 'Account termination',
            body: 'We reserve the right to terminate any account that violates these terms. You can delete your account at any time by contacting hello@picdrop.live.'
          },
          {
            title: 'Changes to these terms',
            body: 'We may update these terms occasionally. Continued use of Picdrop after changes means you accept the new terms. We\'ll do our best to notify users of significant changes.'
          },
          {
            title: 'Contact',
            body: 'Questions about these terms? Email us at hello@picdrop.live.'
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: '36px' }}>
            <div style={{ fontSize: '16px', fontWeight: '500', color: '#ffffff', marginBottom: '10px' }}>{section.title}</div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8 }}>{section.body}</div>
          </div>
        ))}
      </div>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
        © 2026 Picdrop.live · <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => window.location.href = '/privacy'}>Privacy</span>
      </footer>
    </div>
  )
}