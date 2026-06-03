import Features from './features'
import Navbar from './navbar'
import HowStrip from './howstrip'
export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#1C1830',
      fontFamily: 'sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '24px'
    }}>
      <Navbar />
      <div style={{
        fontSize: '13px',
        color: '#9B8FE4',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: '18px',
        border: '1px solid rgba(155,143,228,0.4)',
        padding: '4px 14px',
        borderRadius: '99px',
        display: 'inline-block'
      }}>
        No social media required
      </div>

      <h1 style={{
        fontFamily: 'Georgia, serif',
        fontSize: 'clamp(40px, 6vw, 64px)',
        color: '#ffffff',
        lineHeight: 1.08,
        marginBottom: '20px',
        maxWidth: '700px'
      }}>
        Share your photos,<br />
        <em style={{ color: '#9B8FE4' }}>not your feed.</em>
      </h1>

      <p style={{
        fontSize: '16px',
        color: 'rgba(255,255,255,0.55)',
        lineHeight: 1.7,
        marginBottom: '36px',
        maxWidth: '460px'
      }}>
        Create a private photo page for your trip, event, or moment. 
        Customize it. Share the link. It disappears.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button style={{
          background: '#6040C8',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500',
          padding: '12px 28px',
          borderRadius: '9px',
          border: 'none',
          cursor: 'pointer'
        }}>
          Create a photo drop
        </button>
        <button style={{
          background: 'transparent',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '14px',
          padding: '11px 24px',
          borderRadius: '9px',
          border: '1px solid rgba(255,255,255,0.2)',
          cursor: 'pointer'
        }}>
          See a demo
        </button>
      </div>
      <HowStrip /><Features />
    </main>
  )
}
