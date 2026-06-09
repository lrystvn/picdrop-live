export default function HowStrip() {
  const steps = [
    { num: '01', title: 'Upload your photos', desc: 'Drag & drop or pick from your camera roll. Any number of photos.' },
    { num: '02', title: 'Make it yours', desc: 'Pick a vibe, spacing, and layout. Your page, your feel.' },
    { num: '03', title: 'Set your link', desc: 'Custom slug, expiry date, optional password protection.' },
    { num: '04', title: 'It disappears', desc: 'Link expires automatically. Photos deleted. No digital clutter.' }
  ]

  return (
    <div style={{
      background: '#ffffff',
      padding: '64px 24px',
      width: '100%'
    }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '11px', fontWeight: '500', color: '#6040C8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
            How it works
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 3vw, 32px)', color: '#1C1830', lineHeight: 1.2 }}>
            Four steps to sharing privately
          </div>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2px',
          background: 'rgba(83,74,183,0.08)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          {steps.map((step, i) => (
            <div key={step.num} style={{
              background: '#ffffff',
              padding: '32px 24px',
              position: 'relative'
            }}>
              <div style={{
                fontSize: '11px', fontWeight: '600', color: '#6040C8',
                letterSpacing: '0.08em', marginBottom: '16px', opacity: 0.5
              }}>
                {step.num}
              </div>
              <div style={{ fontSize: '15px', fontWeight: '500', color: '#1C1830', marginBottom: '8px', lineHeight: 1.3 }}>
                {step.title}
              </div>
              <div style={{ fontSize: '13px', color: '#6B6485', lineHeight: 1.6 }}>
                {step.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}