'use client'
export default function UseCases() {
  const cases = [
    {
      emoji: '🏢',
      title: 'Share with your work team',
      desc: 'Went on a trip or offsite? Share photos with your crew without posting on social media or blowing up the group chat with 30 photos.',
      tag: 'Most popular'
    },
    {
      emoji: '🛍',
      title: 'Extra photos for listings',
      desc: 'Selling something unique? Drop a link in your listing with 20+ extra photos that Etsy, Depop, or Marketplace won\'t let you post.',
      tag: 'Top use case'
    },
    {
      emoji: '👨‍👩‍👧',
      title: 'Family moments',
      desc: 'Grandparents see the birthday party, cousins get the reunion photos — no Instagram required.',
      tag: ''
    },
    {
      emoji: '💍',
      title: 'Weddings & events',
      desc: 'Guests share their candid shots in one place before the professional photos are ready.',
      tag: ''
    },
    {
      emoji: '🎉',
      title: 'Bachelorette & group trips',
      desc: 'Photos you want to share with the group but definitely not post on the internet forever.',
      tag: ''
    },
    {
      emoji: '🔨',
      title: 'Contractors & services',
      desc: 'Share before and after project photos with clients privately before posting publicly.',
      tag: ''
    },
    {
      emoji: '📸',
      title: 'Photographers',
      desc: 'Send proof galleries to clients before final delivery. Password protect each one.',
      tag: ''
    },
    {
      emoji: '🏈',
      title: 'Youth sports & coaches',
      desc: 'Share game day photos with parents privately. Link expires so nothing lives online forever.',
      tag: ''
    },
    {
      emoji: '🎓',
      title: 'Graduations & milestones',
      desc: 'Share the big day with extended family privately without making a whole social media post.',
      tag: ''
    },
    {
      emoji: '🏥',
      title: 'Personal journeys',
      desc: 'Share health updates, recovery progress, or personal milestones with close family only.',
      tag: ''
    }
  ]

  return (
    <div style={{
      background: '#1C1830',
      padding: '64px 24px',
      width: '100%'
    }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '500',
            color: '#9B8FE4',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>
            Who uses Picdrop
          </div>
          <div style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(28px, 4vw, 42px)',
            color: '#ffffff',
            lineHeight: 1.15,
            marginBottom: '14px'
          }}>
            Every situation where you think<br />
            <em style={{ color: '#9B8FE4' }}>"I just want to share these photos"</em>
          </div>
          <div style={{
            fontSize: '15px',
            color: 'rgba(255,255,255,0.45)',
            maxWidth: '480px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            No social media. No group texts. Just a link that works and then disappears.
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '12px'
        }}>
          {cases.map((c, i) => (
            <div key={i} style={{
              background: i < 2 ? 'rgba(96,64,200,0.15)' : 'rgba(255,255,255,0.05)',
              border: i < 2 ? '1px solid rgba(155,143,228,0.3)' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
              padding: '22px',
              transition: 'border-color .15s'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ fontSize: '28px' }}>{c.emoji}</div>
                {c.tag && (
                  <div style={{
                    fontSize: '10px',
                    fontWeight: '500',
                    padding: '3px 8px',
                    borderRadius: '99px',
                    background: 'rgba(155,143,228,0.2)',
                    color: '#9B8FE4',
                    border: '1px solid rgba(155,143,228,0.3)'
                  }}>
                    {c.tag}
                  </div>
                )}
              </div>
              <div style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#ffffff',
                marginBottom: '6px'
              }}>
                {c.title}
              </div>
              <div style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.55
              }}>
                {c.desc}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            onClick={() => window.location.href = '/create'}
            style={{
              background: '#6040C8',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              padding: '13px 32px',
              borderRadius: '9px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Create your first drop
          </button>
        </div>
      </div>
    </div>
  )
}