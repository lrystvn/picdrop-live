'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

const PicdropLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '9px', cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
    <div style={{ width: 22, height: 22, background: '#6040C8', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="1" width="5" height="5" rx="1" fill="white" opacity="0.95"/>
        <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.6"/>
        <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.6"/>
        <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.3"/>
      </svg>
    </div>
    <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '22px', fontWeight: '600', color: '#ffffff', letterSpacing: '-0.04em', lineHeight: 1 }}>
      pic<span style={{ color: '#9B8FE4' }}>drop</span>
    </span>
  </div>
)

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [drops, setDrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUser(user)
      await loadDrops(user.id)
      setLoading(false)
    }
    init()
  }, [])

  const loadDrops = async (userId) => {
    const { data } = await supabase
      .from('drops')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (data) setDrops(data)
  }

  const deleteDrop = async (id) => {
    if (!confirm('Delete this drop? This cannot be undone.')) return
    await supabase.from('photos').delete().eq('drop_id', id)
    await supabase.from('drops').delete().eq('id', id)
    setDrops(prev => prev.filter(d => d.id !== id))
  }

  const copyLink = (drop) => {
    navigator.clipboard.writeText(`picdrop.live/drop/${drop.slug}`)
    setCopiedId(drop.id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const getDaysLeft = (expiresAt) => {
    const diff = new Date(expiresAt) - new Date()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const activeDrops = drops.filter(d => getDaysLeft(d.expires_at) > 0)
  const totalViews = drops.reduce((sum, d) => sum + (d.view_count || 0), 0)

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F2F0F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#6B6485', fontSize: '14px' }}>Loading...</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F2F0F8', fontFamily: 'sans-serif' }}>

      {/* NAV */}
      <nav style={{
        background: 'rgba(28,24,48,0.96)', backdropFilter: 'blur(12px)',
        padding: '0 28px', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <PicdropLogo />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', display: 'none' }}>{user?.email}</div>
          <button onClick={handleSignOut} style={{
            background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: '13px',
            padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer'
          }}>Sign out</button>
        </div>
      </nav>

      <div style={{ maxWidth: '880px', margin: '0 auto', padding: '40px 24px' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '30px', color: '#1C1830', letterSpacing: '-0.02em', marginBottom: '4px' }}>Your drops</div>
            <div style={{ fontSize: '14px', color: '#6B6485' }}>
              {activeDrops.length} active · {drops.length} total · {totalViews} views
            </div>
          </div>
          <button onClick={() => window.location.href = '/create'} style={{
            background: '#6040C8', color: 'white', fontSize: '14px', fontWeight: '500',
            padding: '11px 22px', borderRadius: '9px', border: 'none', cursor: 'pointer',
            letterSpacing: '-0.01em'
          }}>+ New drop</button>
        </div>

        {/* DROPS LIST */}
        <div style={{ display: 'grid', gap: '10px' }}>
          {drops.length === 0 ? (
            <div style={{
              background: '#fff', border: '1px solid rgba(83,74,183,0.12)',
              borderRadius: '18px', padding: '64px 24px', textAlign: 'center'
            }}>
              <div style={{
                width: '56px', height: '56px', background: '#EDE9F9',
                borderRadius: '14px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 16px', fontSize: '26px'
              }}>📷</div>
              <div style={{ fontSize: '17px', fontWeight: '500', color: '#1C1830', marginBottom: '8px', letterSpacing: '-0.01em' }}>
                No drops yet
              </div>
              <div style={{ fontSize: '14px', color: '#6B6485', marginBottom: '24px', lineHeight: 1.6 }}>
                Create your first drop and share your photos<br />with exactly the right people.
              </div>
              <button onClick={() => window.location.href = '/create'} style={{
                background: '#6040C8', color: 'white', fontSize: '14px', fontWeight: '500',
                padding: '11px 24px', borderRadius: '9px', border: 'none', cursor: 'pointer'
              }}>+ Create your first drop</button>
            </div>
          ) : (
            drops.map(drop => {
              const daysLeft = getDaysLeft(drop.expires_at)
              const expired = daysLeft <= 0
              const urgent = !expired && daysLeft <= 3
              const copied = copiedId === drop.id

              return (
                <div key={drop.id} style={{
                  background: '#fff',
                  border: `1px solid ${expired ? 'rgba(83,74,183,0.08)' : urgent ? 'rgba(220,100,60,0.25)' : 'rgba(83,74,183,0.12)'}`,
                  borderRadius: '14px',
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  opacity: expired ? 0.45 : 1,
                  transition: 'border-color .15s'
                }}>

                  {/* VIBE DOT */}
                  <div style={{
                    width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0,
                    background: expired ? '#D3D1C7' : urgent ? '#D85A30' : '#6040C8'
                  }} />

                  {/* INFO */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '500', fontSize: '15px', color: '#1C1830', marginBottom: '4px', letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {drop.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6B6485', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <a href={`https://picdrop.live/drop/${drop.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: '#6040C8', textDecoration: 'none' }}>
                        picdrop.live/drop/{drop.slug}
                      </a>
                      <span style={{ color: '#D3D1C7' }}>·</span>
                      <span style={{ color: urgent ? '#D85A30' : '#6B6485', fontWeight: urgent ? '500' : '400' }}>
                        {expired ? 'Expired' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
                      </span>
                      {drop.view_count > 0 && (
                        <>
                          <span style={{ color: '#D3D1C7' }}>·</span>
                          <span>{drop.view_count} view{drop.view_count !== 1 ? 's' : ''}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0, flexWrap: 'wrap' }}>
                    {!expired && (
                      <>
                        <button onClick={() => window.location.href = `/drop/${drop.slug}`} style={{
                          background: '#EDE9F9', color: '#6040C8', fontSize: '12px', fontWeight: '500',
                          padding: '7px 14px', borderRadius: '7px', border: 'none', cursor: 'pointer'
                        }}>View</button>
                        <button onClick={() => window.location.href = `/edit/${drop.slug}`} style={{
                          background: '#F2F0F8', color: '#1C1830', fontSize: '12px', fontWeight: '500',
                          padding: '7px 14px', borderRadius: '7px', border: 'none', cursor: 'pointer'
                        }}>Edit</button>
                      </>
                    )}
                    <button onClick={() => copyLink(drop)} style={{
                      background: copied ? '#E1F5EE' : '#F2F0F8',
                      color: copied ? '#0F6E56' : '#6B6485',
                      fontSize: '12px', fontWeight: '500',
                      padding: '7px 14px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                      transition: 'all .15s'
                    }}>
                      {copied ? '✓ Copied' : 'Copy link'}
                    </button>
                    <button onClick={() => deleteDrop(drop.id)} style={{
                      background: '#FEF2F2', color: '#DC2626', fontSize: '12px', fontWeight: '500',
                      padding: '7px 14px', borderRadius: '7px', border: 'none', cursor: 'pointer'
                    }}>Delete</button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}