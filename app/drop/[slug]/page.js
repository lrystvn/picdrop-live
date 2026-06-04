'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../supabase'

export default function DropViewer() {
  const { slug } = useParams()
  const [drop, setDrop] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [pwError, setPwError] = useState('')
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    const fetchDrop = async () => {
      const { data, error } = await supabase
        .from('drops')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error || !data) {
        setLoading(false)
        return
      }

      const expired = new Date(data.expires_at) < new Date()
      if (expired) {
        setDrop({ expired: true })
        setLoading(false)
        return
      }

      setDrop(data)

      if (!data.password) {
        await loadPhotos(data.id)
        setAuthenticated(true)
      }

      await supabase
        .from('drops')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', data.id)

      setLoading(false)
    }
    fetchDrop()
  }, [slug])

  const loadPhotos = async (dropId) => {
    const { data } = await supabase
      .from('photos')
      .select('*')
      .eq('drop_id', dropId)

    if (data) {
      const withUrls = data.map(p => {
        const { data: urlData } = supabase.storage
          .from('photos')
          .getPublicUrl(p.file_path)
        return { ...p, url: urlData.publicUrl }
      })
      setPhotos(withUrls)
    }
  }

  const checkPassword = async () => {
    if (password === drop.password) {
      await loadPhotos(drop.id)
      setAuthenticated(true)
      setPwError('')
    } else {
      setPwError('Incorrect password. Try again.')
    }
  }

  const getDaysLeft = () => {
    const diff = new Date(drop.expires_at) - new Date()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#1C1830', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Loading...</div>
    </div>
  )

  if (!drop) return (
    <div style={{ minHeight: '100vh', background: '#1C1830', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
      <div>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '24px', color: '#fff', marginBottom: '8px' }}>Drop not found</div>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>This link doesn't exist or has expired.</div>
      </div>
    </div>
  )

  if (drop.expired) return (
    <div style={{ minHeight: '100vh', background: '#1C1830', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
      <div>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏱</div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '24px', color: '#fff', marginBottom: '8px' }}>This drop has expired</div>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>The link has expired and photos have been deleted.</div>
      </div>
    </div>
  )

  if (drop.password && !authenticated) return (
    <div style={{ minHeight: '100vh', background: '#1C1830', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: '#fff', borderRadius: '14px', padding: '40px 36px', maxWidth: '360px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#1C1830', marginBottom: '20px' }}>
          Pic<span style={{ color: '#6040C8', fontStyle: 'italic' }}>drop</span>
        </div>
        <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔒</div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '20px', marginBottom: '6px', color: '#1C1830' }}>This drop is private</div>
        <div style={{ fontSize: '14px', color: '#6B6485', marginBottom: '22px' }}>Enter the password to view the photos.</div>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && checkPassword()}
          style={{ width: '100%', padding: '10px 13px', border: '1px solid rgba(83,74,183,0.25)', borderRadius: '9px', fontSize: '14px', textAlign: 'center', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box', marginBottom: '6px' }}
        />
        {pwError && <div style={{ fontSize: '12px', color: '#A32D2D', marginBottom: '10px' }}>{pwError}</div>}
        <button onClick={checkPassword} style={{ width: '100%', background: '#6040C8', color: 'white', fontSize: '14px', fontWeight: '500', padding: '12px', borderRadius: '9px', border: 'none', cursor: 'pointer', marginTop: '6px' }}>
          View photos
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#1C1830', paddingBottom: '56px' }}>
      {lightbox !== null && (
        <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img src={photos[lightbox].url} style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px' }} />
            <div onClick={() => setLightbox(null)} style={{ position: 'fixed', top: '20px', right: '24px', fontSize: '28px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>×</div>
            {lightbox > 0 && <div onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1) }} style={{ position: 'fixed', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '28px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>‹</div>}
            {lightbox < photos.length - 1 && <div onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1) }} style={{ position: 'fixed', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '28px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>›</div>}
          </div>
        </div>
      )}

      <nav style={{ background: '#1C1830', padding: '0 28px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div onClick={() => window.location.href = '/'} style={{ fontFamily: 'Georgia, serif', fontSize: '21px', color: '#ffffff', cursor: 'pointer' }}>
          Pic<span style={{ color: '#9B8FE4', fontStyle: 'italic' }}>drop</span>
        </div>
        <button onClick={() => window.location.href = '/create'} style={{ background: '#6040C8', color: 'white', fontSize: '13px', fontWeight: '500', padding: '8px 18px', borderRadius: '9px', border: 'none', cursor: 'pointer' }}>
          + Create your own
        </button>
      </nav>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px 28px' }}>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', marginBottom: '10px' }}>
          picdrop.live/{slug}
        </div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px, 4vw, 46px)', color: '#fff', lineHeight: 1.15, marginBottom: '10px' }}>
          {drop.title}
        </div>
        {drop.caption && (
          <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', marginBottom: '18px', lineHeight: 1.6 }}>
            {drop.caption}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '99px', background: 'rgba(155,143,228,0.2)', color: '#9B8FE4', border: '1px solid rgba(155,143,228,0.3)' }}>
            📷 {photos.length} photo{photos.length !== 1 ? 's' : ''}
          </span>
          <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '99px', background: 'rgba(29,158,117,0.15)', color: '#5DCAA5', border: '1px solid rgba(29,158,117,0.25)' }}>
            ⏱ Expires in {getDaysLeft()} day{getDaysLeft() !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>
        {photos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.25)', fontSize: '14px', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '14px' }}>
            No photos yet
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', borderRadius: '14px', overflow: 'hidden' }}>
            {photos.map((p, i) => (
              <div key={i} onClick={() => setLightbox(i)} style={{ aspectRatio: '1', overflow: 'hidden', cursor: 'pointer' }}>
                <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity .15s' }} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ maxWidth: '860px', margin: '16px auto 0', padding: '0 24px' }}>
        <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
          Created with <strong style={{ fontFamily: 'Georgia, serif' }}>Picdrop</strong> · Expires in {getDaysLeft()} days · <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => window.location.href = '/'}>Create your own</span>
        </div>
      </div>
    </div>
  )
}