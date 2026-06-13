export default function Features() {
  const features = [
    { title: 'Auto-expiry', desc: '7, 14, or 30 days. The link 404s and photos purge automatically. No cleanup required.' },
    { title: 'Custom slug', desc: 'picdrop.live/drop/yourslug — something personal and memorable, not a random string.' },
    { title: 'Six vibes', desc: 'Electric, Clean, Dark Room, Earthy, Ocean, Film Roll. Each one sets the whole look and feel.' },
    { title: 'Password protection', desc: 'Add a password to any drop. Viewers enter it before they can see anything.' },
    { title: 'View count', desc: 'See exactly how many times your drop has been opened. Only visible to you.' },
    { title: 'Photo captions', desc: 'Add a caption to any photo. Shows up when someone opens it in the lightbox.' },
    { title: 'Drag to reorder', desc: 'Arrange your photos in any order before publishing. First photo becomes the cover.' },
    { title: 'No account to view', desc: 'The people you share with just click the link. No sign-up, no friction.' },
  ]

  return (
    <div style={{ background: '#F7F5FF', padding: '80px 24px', width: '100%' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#6040C8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Features
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 3.5vw, 38px)', color: '#1C1830', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
              Everything included.<br />Nothing bolted on.
            </div>
            <div style={{ fontSize: '14px', color: '#6B6485', maxWidth: '280px', lineHeight: 1.6 }}>
              No tiers, no paywalls, no feature gates. Free while we're in beta.
            </div>
          </div>
        </div>

        {/* FEATURE LIST — two column editorial style */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '0px' }}>
          {features.map((f, i) => (
            <div key={f.title} style={{
              padding: '24px 0',
              borderTop: '1px solid rgba(83,74,183,0.12)',
              borderRight: i % 2 === 0 ? '1px solid rgba(83,74,183,0.12)' : 'none',
              paddingRight: i % 2 === 0 ? '40px' : '0',
              paddingLeft: i % 2 === 1 ? '40px' : '0',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start'
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6040C8', flexShrink: 0, marginTop: '7px', opacity: 0.6 }} />
              <div>
                <div style={{ fontSize: '15px', fontWeight: '500', color: '#1C1830', marginBottom: '5px', letterSpacing: '-0.01em' }}>
                  {f.title}
                </div>
                <div style={{ fontSize: '13px', color: '#6B6485', lineHeight: 1.7 }}>
                  {f.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM CTA */}
        <div style={{ borderTop: '1px solid rgba(83,74,183,0.12)', paddingTop: '40px', marginTop: '0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ fontSize: '15px', color: '#6B6485' }}>
            Ready to try it?
          </div>
          <button
            onClick={() => window.location.href = '/create'}
            style={{ background: '#6040C8', color: 'white', fontSize: '14px', fontWeight: '500', padding: '12px 24px', borderRadius: '9px', border: 'none', cursor: 'pointer', letterSpacing: '-0.01em' }}
          >
            Create your first drop
          </button>
        </div>

      </div>
    </div>
  )
}