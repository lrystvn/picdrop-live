export default function HowStrip() {
  const steps = [
    { num: '01', title: 'Upload your photos', desc: 'Pick from your camera roll or drag and drop. Up to 50 photos, drag to reorder.' },
    { num: '02', title: 'Make it yours', desc: 'Choose a vibe, spacing, and layout. Your drop page, your feel.' },
    { num: '03', title: 'Set your link', desc: 'Pick a custom slug, set an expiry, add a password if you want.' },
    { num: '04', title: 'Share and forget', desc: 'Drop the link in Slack, a text, wherever. It disappears when you\'re done.' }
  ]

  return (
    <div style={{ background: '#ffffff', padding: '80px 24px', width: '100%' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
          {/* HEADER ROW */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#6040C8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
                How it works
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 3.5vw, 38px)', color: '#1C1830', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
                Up and running<br />in under a minute.
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/create'}
              style={{ background: '#6040C8', color: 'white', fontSize: '14px', fontWeight: '500', padding: '12px 24px', borderRadius: '9px', border: 'none', cursor: 'pointer', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}
            >
              Try it now
            </button>
          </div>

          {/* STEPS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
            {steps.map((step, i) => (
              <div key={step.num} style={{ position: 'relative' }}>
                {/* NUMBER */}
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '48px', color: '#EDE9F9', lineHeight: 1, marginBottom: '16px', letterSpacing: '-0.02em' }}>
                  {step.num}
                </div>
                {/* CONNECTOR LINE */}
                {i < 3 && (
                  <div style={{ display: 'none' }} />
                )}
                <div style={{ width: '32px', height: '2px', background: '#6040C8', marginBottom: '14px', opacity: 0.4 }} />
                <div style={{ fontSize: '15px', fontWeight: '500', color: '#1C1830', marginBottom: '8px', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
                  {step.title}
                </div>
                <div style={{ fontSize: '13px', color: '#6B6485', lineHeight: 1.7 }}>
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}