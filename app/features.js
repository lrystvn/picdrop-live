export default function Features() {
  const features = [
    { icon: '⏱', title: 'Auto-expiry', desc: '7, 14, or 30 days. Link 404s and photos purge automatically.' },
    { icon: '🔗', title: 'Custom slug', desc: 'picdrop.live/yourslug — personal and memorable.' },
    { icon: '🎨', title: 'Customizable', desc: 'Colors, fonts, layouts. Your page, your vibe.' },
    { icon: '🔒', title: 'Password lock', desc: 'Optional per drop. Great for work or family groups.' },
    { icon: '👁', title: 'View count', desc: 'Know who has seen your drop. Analytics only visible to you.' },
    { icon: '📦', title: 'Download zip', desc: 'Viewers can save everything before the link expires.' }
  ]

  return (
    <div style={{
      maxWidth: '820px',
      margin: '0 auto',
      padding: '52px 24px',
      width: '100%'
    }}>
      <div style={{
        fontSize: '11px',
        fontWeight: '500',
        color: '#6040C8',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: '28px',
        textAlign: 'center'
      }}>
        Everything included
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px'
      }}>
        {features.map((f) => (
          <div key={f.title} style={{
            background: '#ffffff',
            border: '1px solid rgba(83,74,183,0.15)',
            borderRadius: '14px',
            padding: '20px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              background: '#EDE9F9',
              borderRadius: '9px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              marginBottom: '12px'
            }}>
              {f.icon}
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '5px',
              color: '#1C1830'
            }}>
              {f.title}
            </div>
            <div style={{
              fontSize: '13px',
              color: '#6B6485',
              lineHeight: 1.5
            }}>
              {f.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}