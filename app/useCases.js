'use client'
export default function UseCases() {
  const featured = [
    {
      emoji: '🏢',
      title: 'Share your trip with the team',
      desc: 'Went on a work trip or team offsite? Share your personal photos with your crew privately — no social media post, no 30-photo group chat explosion.',
      tag: 'Most popular'
    },
    {
      emoji: '💍',
      title: 'Weddings & events',
      desc: 'Create one link for all your guests to view everyone\'s candid shots together — before the professional photos are even ready.',
      tag: 'Fan favorite'
    },
  ]

  const rest = [
    { emoji: '👨‍👩‍👧', title: 'Family moments', desc: 'Grandparents see the birthday party without needing Instagram.' },
    { emoji: '🛍', title: 'Extra listing photos', desc: 'Drop a link with 20+ photos that Etsy or Marketplace won\'t allow.' },
    { emoji: '🎉', title: 'Bachelorette trips', desc: 'Photos you want to share with the group but not post forever.' },
    { emoji: '🔨', title: 'Contractors', desc: 'Before and after photos shared privately with clients.' },
    { emoji: '📸', title: 'Photographers', desc: 'Proof galleries with password protection per client.' },
    { emoji: '🏈', title: 'Youth sports', desc: 'Game day photos for parents. Link expires automatically.' },
    { emoji: '🎓', title: 'Graduations', desc: 'Share the big day without making a social media post.' },
    { emoji: '🏥', title: 'Personal journeys', desc: 'Milestones shared with close family only.' },
  ]

  return (
    <div style={{ background: '#1C1830', padding: '80px 24px', width: '100%' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div style={{ fontSize: '11px', fontWeight: '500', color: '#9B8FE4', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Who uses Picdrop
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px, 3.5vw, 38px)', color: '#ffffff', lineHeight: 1.2, marginBottom: '14px' }}>
            Every situation where you think<br />
            <em style={{ color: '#9B8FE4' }}>"I just want to share these photos"</em>
          </div>
          <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', maxWidth: '440px', margin: '0 auto', lineHeight: 1.7 }}>
            No social media. No group texts. Just a link that works and then disappears.
          </div>
        </div>

        {/* FEATURED — large cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px', marginBottom: '12px' }}>
          {featured.map((c, i) => (
            <div key={i} style={{
              background: 'rgba(96,64,200,0.2)',
              border: '1px solid rgba(155,143,228,0.35)',
              borderRadius: '18px',
              padding: '32px 28px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{ fontSize: '36px', lineHeight: 1 }}>{c.emoji}</div>
                <div style={{ fontSize: '10px', fontWeight: '600', padding: '4px 10px', borderRadius: '99px', background: 'rgba(155,143,228,0.25)', color: '#C4B8F0', border: '1px solid rgba(155,143,228,0.4)', letterSpacing: '0.05em' }}>
                  {c.tag}
                </div>
              </div>
              <div style={{ fontSize: '19px', fontWeight: '600', color: '#ffffff', marginBottom: '12px', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
                {c.title}
              </div>
              <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75 }}>
                {c.desc}
              </div>
            </div>
          ))}
        </div>

        {/* REST — compact grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', marginBottom: '48px' }}>
          {rest.map((c, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '14px',
              padding: '20px',
            }}>
              <div style={{ fontSize: '22px', marginBottom: '10px', lineHeight: 1 }}>{c.emoji}</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', marginBottom: '6px', letterSpacing: '-0.01em' }}>
                {c.title}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                {c.desc}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => window.location.href = '/create'} style={{
            background: '#6040C8', color: 'white', fontSize: '15px',
            fontWeight: '500', padding: '14px 36px', borderRadius: '10px',
            border: 'none', cursor: 'pointer', letterSpacing: '-0.01em'
          }}>
            Create your first drop
          </button>
        </div>
      </div>
    </div>
  )
}