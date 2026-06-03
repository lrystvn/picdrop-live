export default function HowStrip() {
  const steps = [
    { num: '01', title: 'Upload your photos', desc: 'Drag & drop or pick from camera roll.' },
    { num: '02', title: 'Make it yours', desc: 'Theme, font, layout — your personal mini-site.' },
    { num: '03', title: 'Set your link', desc: 'Custom slug, expiry, optional password.' },
    { num: '04', title: 'It disappears', desc: 'Auto-deletes on expiry. No digital clutter.' }
  ]

  return (
    <div style={{
      background: '#ffffff',
      borderTop: '1px solid rgba(83,74,183,0.15)',
      borderBottom: '1px solid rgba(83,74,183,0.15)',
      padding: '48px 24px',
      width: '100%'
    }}>
      <div style={{
        maxWidth: '820px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '36px',
        textAlign: 'center'
      }}>
        {steps.map((step) => (
          <div key={step.num}>
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: '36px',
              color: '#6040C8',
              opacity: 0.3,
              lineHeight: 1,
              marginBottom: '6px'
            }}>
              {step.num}
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '5px',
              color: '#1C1830'
            }}>
              {step.title}
            </div>
            <div style={{
              fontSize: '13px',
              color: '#6B6485',
              lineHeight: 1.5
            }}>
              {step.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}