'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../supabase'

const VIBES = {
  electric: { bg: '#1C1830', navBg: '#12101F', accent: '#9B8FE4', text: '#ffffff', subtext: 'rgba(255,255,255,0.5)', font: 'Georgia, serif', border: 'rgba(255,255,255,0.08)', footerText: 'rgba(255,255,255,0.25)' },
  clean: { bg: '#F8F8F8', navBg: '#ffffff', accent: '#333333', text: '#1C1830', subtext: '#6B6485', font: 'DM Sans, sans-serif', border: 'rgba(0,0,0,0.08)', footerText: '#9B9BA8' },
  darkroom: { bg: '#111111', navBg: '#0A0A0A', accent: '#ffffff', text: '#ffffff', subtext: 'rgba(255,255,255,0.45)', font: 'Georgia, serif', border: 'rgba(255,255,255,0.06)', footerText: 'rgba(255,255,255,0.2)' },
  earthy: { bg: '#1A2E1A', navBg: '#122012', accent: '#7DBF7D', text: '#E8F5E8', subtext: 'rgba(232,245,232,0.55)', font: 'Georgia, serif', border: 'rgba(125,191,125,0.15)', footerText: 'rgba(232,245,232,0.25)' },
  ocean: { bg: '#0A1628', navBg: '#061020', accent: '#4A9EDB', text: '#E8F4FD', subtext: 'rgba(232,244,253,0.5)', font: 'DM Sans, sans-serif', border: 'rgba(74,158,219,0.15)', footerText: 'rgba(232,244,253,0.25)' },
  film: { bg: '#1C1410', navBg: '#120E09', accent: '#D4A853', text: '#F5ECD7', subtext: 'rgba(245,236,215,0.5)', font: 'Space Mono, monospace', border: 'rgba(212,168,83,0.15)', footerText: 'rgba(245,236,215,0.25)' },
}

const SPACING = {
  tight: { gap: '0px', borderRadius: '0px' },
  normal: { gap: '4px', borderRadius: '14px' },
  airy: { gap: '12px', borderRadius: '14px' },
}

export default function DropViewer() {
  const { slug } = useParams()
  const [drop, setDrop] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [pwError, setPwError] = useState('')
  const [lightbox, setLightbox] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 600)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const fetchDrop = async () => {
      const { data, error } = await supabase
        .from('drops')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error || !data) { setLoading(false); return }

      const expired = new Date(data.expires_at) < new Date()
      if (expired) { setDrop({ expired: true }); setLoading(false); return }

      setDrop(data)
      if (!data.password) { await loadPhotos(data.id); setAuthenticated(true) }
      await supabase.from('drops').update({ view_count: (data.view_count || 0) + 1 }).eq('id', data.id)
      setLoading(false)
    }
    fetchDrop()
  }, [slug])

  const loadPhotos = async (dropId) => {
    const { data } = await supabase.from('photos').select('*').eq('drop_id', dropId)
    if (data) {
      const withUrls = data.map(p => {
        const { data: urlData } = supabase.storage.from('photos').getPublicUrl(p.file_path)
        return { ...p, url: urlData.publicUrl }
      })
      setPhotos(withUrls)
    }
  }

  const checkPassword = async () => {
    if (password === drop.password) { await loadPhotos(drop.id); setAuthenticated(true); setPwError('') }
    else setPwError('Incorrect password. Try again.')
  }

  const getDaysLeft = () => Math.ceil((new Date(drop.expires_at) - new Date()) / (1000 * 60 * 60 * 24))

  const getGridCols = () => {
    if (drop.layout === 'grid2') return 'repeat(2, 1fr)'
    return 'repeat(3, 1fr)'
  }

  const v = VIBES[drop?.vibe] || VIBES.electric
  const spacing = SPACING[drop?.spacing] || SPACING.normal
  const isDark = ['electric','darkroom','earthy','ocean','film'].includes(drop?.vibe)
  const pad = isMobile ? '12px' : '24px'

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
    <div style={{ minHeight: '100vh', background: v.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff', border: `1px solid ${v.border}`, borderRadius: '14px', padding: isMobile ? '28px 20px' : '40px 36px', maxWidth: '360px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: v.text, marginBottom: '20px' }}>
          Pic<span style={{ color: v.accent, fontStyle: 'italic' }}>drop</span>
        </div>
        <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔒</div>
        <div style={{ fontFamily: v.font, fontSize: '20px', marginBottom: '6px', color: v.text }}>This drop is private</div>
        <div style={{ fontSize: '14px', color: v.subtext, marginBottom: '22px' }}>Enter the password to view the photos.</div>
        <input type="password" placeholder="Enter password" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && checkPassword()}
          style={{ width: '100%', padding: '10px 13px', border: `1px solid ${v.border}`, borderRadius: '9px', fontSize: '16px', textAlign: 'center', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box', marginBottom: '6px', background: isDark ? 'rgba(255,255,255,0.05)' : '#fff', color: v.text }} />
        {pwError && <div style={{ fontSize: '12px', color: '#E24B4A', marginBottom: '10px' }}>{pwError}</div>}
        <button onClick={checkPassword} style={{ width: '100%', background: v.accent, color: isDark ? '#000' : '#fff', fontSize: '14px', fontWeight: '500', padding: '14px', borderRadius: '9px', border: 'none', cursor: 'pointer', marginTop: '6px' }}>
          View photos
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: v.bg, paddingBottom: '56px', fontFamily: v.font }}>

      {/* LIGHTBOX */}
      {lightbox !== null && (
        <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '8px' : '24px' }}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: '98vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={photos[lightbox].url} style={{ maxWidth: '100%', maxHeight: photos[lightbox].caption ? '75vh' : '85vh', objectFit: 'contain', borderRadius: '4px', display: 'block' }} />
            {photos[lightbox].caption && (
              <div style={{ marginTop: '10px', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', textAlign: 'center', maxWidth: '500px' }}>
                <div style={{ fontSize: isMobile ? '13px' : '14px', color: 'rgba(255,255,255,0.9)', lineHeight: 1.4 }}>
                  {photos[lightbox].caption}
                </div>
              </div>
            )}
          </div>
          <div onClick={() => setLightbox(null)} style={{ position: 'fixed', top: '12px', right: '12px', fontSize: '28px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', zIndex: 201 }}>×</div>
          {lightbox > 0 && (
            <div onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1) }} style={{ position: 'fixed', left: '4px', top: '50%', transform: 'translateY(-50%)', fontSize: isMobile ? '40px' : '28px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '8px' }}>‹</div>
          )}
          {lightbox < photos.length - 1 && (
            <div onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1) }} style={{ position: 'fixed', right: '4px', top: '50%', transform: 'translateY(-50%)', fontSize: isMobile ? '40px' : '28px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '8px' }}>›</div>
          )}
          <div style={{ position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
            {lightbox + 1} / {photos.length}
          </div>
        </div>
      )}

      {/* NAV */}
      <nav style={{ background: v.navBg, padding: `0 ${pad}`, height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${v.border}` }}>
        <div onClick={() => window.location.href = '/'} style={{ fontFamily: 'Georgia, serif', fontSize: '21px', color: v.text, cursor: 'pointer' }}>
          Pic<span style={{ color: v.accent, fontStyle: 'italic' }}>drop</span>
        </div>
        <button onClick={() => window.location.href = '/create'} style={{ background: v.accent, color: isDark ? '#000' : '#fff', fontSize: '13px', fontWeight: '500', padding: '8px 14px', borderRadius: '9px', border: 'none', cursor: 'pointer' }}>
          {isMobile ? '+ Create' : '+ Create your own'}
        </button>
      </nav>

      {/* HEADER */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: `${isMobile ? '20px' : '40px'} ${pad} 16px` }}>
        <div style={{ fontSize: '11px', color: v.subtext, fontFamily: 'monospace', marginBottom: '8px', opacity: 0.6 }}>
          picdrop.live/drop/{slug}
        </div>
        <div style={{ fontFamily: v.font, fontSize: isMobile ? '24px' : 'clamp(28px, 4vw, 46px)', color: v.text, lineHeight: 1.15, marginBottom: '8px' }}>
          {drop.title}
        </div>
        {drop.caption && (
          <div style={{ fontSize: isMobile ? '13px' : '15px', color: v.subtext, marginBottom: '12px', lineHeight: 1.6 }}>
            {drop.caption}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '99px', background: `${v.accent}22`, color: v.accent, border: `1px solid ${v.accent}44` }}>
            📷 {photos.length} photo{photos.length !== 1 ? 's' : ''}
          </span>
          {drop.show_expiry !== false && (
            <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '99px', background: 'rgba(29,158,117,0.15)', color: '#5DCAA5', border: '1px solid rgba(29,158,117,0.25)' }}>
              ⏱ {getDaysLeft()} day{getDaysLeft() !== 1 ? 's' : ''} left
            </span>
          )}
        </div>
      </div>

      {/* PHOTOS */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: spacing.gap === '0px' ? '0' : `0 ${isMobile ? '4px' : '24px'}` }}>
        {photos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: v.subtext, fontSize: '14px', border: `1px dashed ${v.border}`, borderRadius: '14px', margin: `0 ${pad}` }}>
            No photos yet
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: getGridCols(),
            gap: isMobile ? (spacing.gap === '12px' ? '3px' : spacing.gap === '4px' ? '2px' : '0px') : spacing.gap,
            borderRadius: isMobile ? '8px' : spacing.borderRadius,
            overflow: 'hidden'
          }}>
            {photos.map((p, i) => (
              <div key={i} onClick={() => setLightbox(i)} style={{
                aspectRatio: !isMobile && drop.layout === 'masonry' && i === 0 ? 'unset' : '1',
                gridRow: !isMobile && drop.layout === 'masonry' && i === 0 ? 'span 2' : 'auto',
                overflow: 'hidden',
                cursor: 'pointer',
                borderRadius: spacing.gap === '12px' ? (isMobile ? '4px' : '8px') : '0px',
                border: drop.spacing === 'airy' ? `2px solid ${v.bg}` : 'none',
                position: 'relative'
              }}>
                <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                {p.caption && !isMobile && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.6))', padding: '16px 8px 6px', pointerEvents: 'none' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.caption}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ maxWidth: '860px', margin: '36px auto 0', padding: `20px ${pad} 0`, borderTop: `1px solid ${v.border}`, fontSize: '12px', color: v.footerText, textAlign: 'center' }}>
        Created with <strong style={{ fontFamily: 'Georgia, serif' }}>Picdrop</strong> · Expires in {getDaysLeft()} days · <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => window.location.href = '/'}>Create your own</span>
      </div>
    </div>
  )
}