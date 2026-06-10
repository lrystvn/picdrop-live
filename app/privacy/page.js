'use client'
import { PicdropLogo } from '../navbar'

export default function Privacy() {
  return (
    <div style={{ minHeight: '100vh', background: '#1C1830', fontFamily: 'sans-serif' }}>
      <nav style={{ background: 'rgba(28,24,48,0.96)', backdropFilter: 'blur(12px)', padding: '0 28px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 100 }}>
        <PicdropLogo />
        <button onClick={() => window.location.href = '/create'} style={{ background: '#6040C8', color: 'white', fontSize: '14px', fontWeight: '500', padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
          + New drop
        </button>
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ fontSize: '11px', fontWeight: '500', color: '#9B8FE4', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Privacy Policy</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px, 4vw, 42px)', color: '#ffffff', lineHeight: 1.15, marginBottom: '12px', letterSpacing: '-0.02em', fontWeight: '400' }}>
          Your privacy matters.
        </h1>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginBottom: '48px' }}>Last updated June 2026</div>

        {[
          {
            title: 'What we collect',
            body: 'We collect your email address when you create an account. We store the photos you upload, the drop settings you configure, and basic usage data like view counts. We do not sell your data to anyone.'
          },
          {
            title: 'How we use your data',
            body: 'Your email is used to log you into your account. Your photos are stored securely and only accessible via the drop link you create. We use anonymous usage data to improve the product.'
          },
          {
            title: 'Photo storage',
            body: 'Photos are stored on Supabase\'s secure cloud storage. When a drop expires, the photos are automatically deleted. You can also delete your drops and photos at any time from your dashboard.'
          },
          {
            title: 'Who can see your photos',
            body: 'Only people with your drop link can view your photos. If you add password protection, only people with both the link and the password can view them. We do not share your photos with anyone.'
          },
          {
            title: 'Cookies',
            body: 'We use minimal cookies to keep you logged in. We do not use advertising or tracking cookies.'
          },
          {
            title: 'Data deletion',
            body: 'You can delete your account and all associated data at any time by contacting us at hello@picdrop.live. Drop photos are automatically deleted when their expiry date passes.'
          },
          {
            title: 'Contact',
            body: 'If you have any questions about this privacy policy, email us at hello@picdrop.live.'
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: '36px' }}>
            <div style={{ fontSize: '16px', fontWeight: '500', color: '#ffffff', marginBottom: '10px' }}>{section.title}</div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8 }}>{section.body}</div>
          </div>
        ))}
      </div>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
        © 2026 Picdrop.live · <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => window.location.href = '/terms'}>Terms</span>
      </footer>
    </div>
  )
}