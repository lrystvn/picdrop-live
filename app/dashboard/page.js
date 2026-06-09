'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [drops, setDrops] = useState([])
  const [loading, setLoading] = useState(true)

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

  const getDaysLeft = (expiresAt) => {
    const diff = new Date(expiresAt) - new Date()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F2F0F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#6B6485', fontSize: '14px' }}>Loading...</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F2F0F8', fontFamily: 'sans-serif' }}>
      <nav style={{
        background: '#1C1830', padding: '0 28px', height: '56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div onClick={() => window.location.href = '/'} style={{ fontFamily: 'Georgia, serif', fontSize: '21px', color: '#ffffff', cursor: 'pointer' }}>
          Pic<span style={{ color: '#9B8FE4', fontStyle: 'italic' }}>drop</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{user?.email}</div>
          <button onClick={handleSignOut} style={{
            background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: '13px',
            padding: '6px 12px', borderRadius: '9px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer'
          }}>Sign out</button>
        </div>
      </nav>

      <div style={{ maxWidth: '880px', margin: '0 auto', padding: '36px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#1C1830' }}>Your drops</div>
            <div style={{ fontSize: '13px', color: '#6B6485', marginTop: '3px' }}>
              {drops.length} drop{drops.length !== 1 ? 's' : ''} · {drops.filter(d => getDaysLeft(d.expires_at) > 0).length} active
            </div>
          </div>
          <button onClick={() => window.location.href = '/create'} style={{
            background: '#6040C8', color: 'white', fontSize: '13px', fontWeight: '500',
            padding: '10px 20px', borderRadius: '9px', border: 'none', cursor: 'pointer'
          }}>+ New drop</button>
        </div>

        <div style={{ display: 'grid', gap: '10px' }}>
          {drops.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid rgba(83,74,183,0.15)', borderRadius: '14px', padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📷</div>
              <div style={{ fontSize: '16px', fontWeight: '500', color: '#1C1830', marginBottom: '6px' }}>No drops yet</div>
              <div style={{ fontSize: '14px', color: '#6B6485', marginBottom: '20px' }}>Create your first drop and share your photos</div>
              <button onClick={() => window.location.href = '/create'} style={{
                background: '#6040C8', color: 'white', fontSize: '13px', fontWeight: '500',
                padding: '10px 20px', borderRadius: '9px', border: 'none', cursor: 'pointer'
              }}>+ Create your first drop</button>
            </div>
          ) : (
            drops.map(drop => {
              const daysLeft = getDaysLeft(drop.expires_at)
              const expired = daysLeft <= 0
              return (
                <div key={drop.id} style={{
                  background: '#fff', border: '1px solid rgba(83,74,183,0.15)',
                  borderRadius: '14px', padding: '16px 20px',
                  display: 'flex', alignItems: 'center', gap: '16px',
                  opacity: expired ? 0.5 : 1
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '500', fontSize: '15px', color: '#1C1830', marginBottom: '4px' }}>
                      {drop.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6B6485' }}>
  <a href={`https://picdrop.live/drop/${drop.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: '#6040C8', textDecoration: 'none' }}>
    picdrop.live/drop/{drop.slug}
  </a>
  {' '}· {expired ? 'Expired' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    {!expired && (
                      <>
                        <button onClick={() => window.location.href = `/drop/${drop.slug}`} style={{
                          background: '#EDE9F9', color: '#6040C8', fontSize: '12px',
                          padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer'
                        }}>View</button>
                        <button onClick={() => window.location.href = `/edit/${drop.slug}`} style={{
                          background: '#F2F0F8', color: '#1C1830', fontSize: '12px',
                          padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer'
                        }}>Edit</button>
                      </>
                    )}
                    <button onClick={() => {
                      navigator.clipboard.writeText(`picdrop.live/drop/${drop.slug}`)
                      alert('Link copied!')
                    }} style={{
                      background: '#F2F0F8', color: '#6B6485', fontSize: '12px',
                      padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer'
                    }}>Copy link</button>
                    <button onClick={() => deleteDrop(drop.id)} style={{
                      background: '#FDEAEA', color: '#A32D2D', fontSize: '12px',
                      padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer'
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