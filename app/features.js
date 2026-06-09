export default function Features() {
  const features = [
    { icon: '⏱', title: 'Auto-expiry', desc: '7, 14, or 30 days. Link 404s and photos purge automatically.' },
    { icon: '🔗', title: 'Custom slug', desc: 'picdrop.live/drop/yourslug — personal and memorable.' },
    { icon: '🎨', title: 'Six vibes', desc: 'Electric, Clean, Dark Room, Earthy, Ocean, Film Roll.' },
    { icon: '🔒', title: 'Password lock', desc: 'Optional per drop. Great for work or family groups.' },
    { icon: '👁', title: 'View count', desc: 'Know who has seen your drop. Analytics only visible to you.' },
    { icon: '📷', title: 'Photo captions', desc: 'Add a caption to each photo. Shows in the lightbox viewer.' }
  ]

  return (
    <div style={{ background: '#F7F5FF', padding: '80px 24px', width: '100%' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '11px', fontWeight: '500', color: '#6040C8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Everything included
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 3vw, 32px)', color: '#1C1830', lineHeight: 1.2 }}>
            Everything you need, nothing you don't
          </div>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '12px'
        }}>
          {features.map((f) => (
            <div key={f.title} style={{
              background: '#ffffff',
              border: '1px solid rgba(83,74,183,0.1)',
              borderRadius: '16px',
              padding: '24px',
              transition: 'border-color .2s, box-shadow .2s'
            }}>
              <div style={{
                width: '40px', height: '40px',
                background: 'linear-gradient(135deg, #EDE9F9, #E0D9F7)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', marginBottom: '14px'
              }}>
                {f.icon}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#1C1830', letterSpacing: '-0.01em' }}>
                {f.title}
              </div>
              <div style={{ fontSize: '13px', color: '#6B6485', lineHeight: 1.6 }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}