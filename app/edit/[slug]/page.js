'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../supabase'

export default function EditDrop() {
  const { slug } = useParams()
  const [drop, setDrop] = useState(null)
  const [photos, setPhotos] = useState([])
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [vibe, setVibe] = useState('electric')
  const [spacing, setSpacing] = useState('normal')
  const [hasPassword, setHasPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [showExpiry, setShowExpiry] = useState(true)
  const [allowDownload, setAllowDownload] = useState(false)
  const [extendDays, setExtendDays] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 600)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const vibes = [
    { id: 'electric', emoji: '💜', name: 'Electric', bg: '#1C1830', accent: '#9B8FE4' },
    { id: 'clean', emoji: '🤍', name: 'Clean & Simple', bg: '#F8F8F8', accent: '#333333' },
    { id: 'darkroom', emoji: '🖤', name: 'Dark Room', bg: '#111111', accent: '#ffffff' },
    { id: 'earthy', emoji: '🌿', name: 'Earthy', bg: '#1A2E1A', accent: '#7DBF7D' },
    { id: 'ocean', emoji: '🌊', name: 'Ocean', bg: '#0A1628', accent: '#4A9EDB' },
    { id: 'film', emoji: '🎞️', name: 'Film Roll', bg: '#1C1410', accent: '#D4A853' },
  ]

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }

      const { data: dropData } = await supabase
        .from('drops')
        .select('*')
        .eq('slug', slug)
        .eq('user_id', user.id)
        .single()

      if (!dropData) { window.location.href = '/dashboard'; return }

      setDrop(dropData)
      setTitle(dropData.title)
      setCaption(dropData.caption || '')
      setVibe(dropData.vibe || 'electric')
      setSpacing(dropData.spacing || 'normal')
      setHasPassword(!!dropData.password)
      setPassword(dropData.password || '')
      setShowExpiry(dropData.show_expiry !== false)
      setAllowDownload(dropData.allow_download || false)
      await loadPhotos(dropData.id)
      setLoading(false)
    }
    init()
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

  const handleAddPhotos = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)

    const BATCH_SIZE = 5
    const photoRecords = []

    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE)
      const results = await Promise.all(
        batch.map(async (file) => {
          const fileExt = file.name.split('.').pop()
          const fileName = `${drop.id}/${Date.now()}-${Math.random().toString(36).substr(2,6)}.${fileExt}`
          const { error } = await supabase.storage.from('photos').upload(fileName, file)
          if (!error) return { drop_id: drop.id, file_path: fileName, caption: '' }
          return null
        })
      )
      photoRecords.push(...results.filter(Boolean))
    }

    if (photoRecords.length > 0) {
      await supabase.from('photos').insert(photoRecords)
    }

    await loadPhotos(drop.id)
    setUploading(false)
    setMessage(`${photoRecords.length} photo${photoRecords.length !== 1 ? 's' : ''} added!`)
    setTimeout(() => setMessage(''), 2000)
  }

  const handleDeletePhoto = async (photo) => {
    if (!confirm('Delete this photo?')) return
    await supabase.storage.from('photos').remove([photo.file_path])
    await supabase.from('photos').delete().eq('id', photo.id)
    setPhotos(prev => prev.filter(p => p.id !== photo.id))
  }

  const getDaysLeft = () => {
    if (!drop) return 0
    return Math.ceil((new Date(drop.expires_at) - new Date()) / (1000 * 60 * 60 * 24))
  }

  const handleSave = async () => {
    setSaving(true)

    const updates = {
      title,
      caption,
      vibe,
      spacing,
      password: hasPassword ? password : null,
      show_expiry: showExpiry,
      allow_download: allowDownload
    }

    if (extendDays > 0) {
      const newExpiry = new Date(drop.expires_at)
      newExpiry.setDate(newExpiry.getDate() + extendDays)
      updates.expires_at = newExpiry.toISOString()
    }

    await supabase.from('drops').update(updates).eq('id', drop.id)
    setSaving(false)
    setMessage('All changes saved!')
    setTimeout(() => setMessage(''), 2000)
    if (extendDays > 0) setExtendDays(0)
  }

  const pad = isMobile ? '16px' : '24px'
  const cardStyle = { background: '#fff', border: '1px solid rgba(83,74,183,0.15)', borderRadius: '14px', padding: isMobile ? '16px' : '22px', marginBottom: '12px' }
  const secLabel = { fontSize: '11px', fontWeight: '500', color: '#6040C8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '16px' }
  const inputStyle = { width: '100%', padding: '10px 13px', border: '1px solid rgba(83,74,183,0.25)', borderRadius: '9px', fontSize: '14px', fontFamily: 'sans-serif', outline: 'none', boxSizing: 'border-box' }

  const Toggle = ({ value, onChange }) => (
    <div onClick={() => onChange(!value)} style={{ width: '42px', height: '24px', borderRadius: '99px', cursor: 'pointer', background: value ? '#6040C8' : '#D3D1C7', position: 'relative', transition: 'background .2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: '3px', left: value ? '21px' : '3px', width: '18px', height: '18px', background: 'white', borderRadius: '50%', transition: 'left .2s' }} />
    </div>
  )

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F2F0F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#6B6485', fontSize: '14px' }}>Loading...</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F2F0F8', fontFamily: 'sans-serif' }}>
      <nav style={{ background: '#1C1830', padding: `0 ${pad}`, height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div onClick={() => window.location.href = '/'} style={{ fontFamily: 'Georgia, serif', fontSize: '21px', color: '#ffffff', cursor: 'pointer' }}>
          Pic<span style={{ color: '#9B8FE4', fontStyle: 'italic' }}>drop</span>
        </div>
        <div onClick={() => window.location.href = '/dashboard'} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
          ← Dashboard
        </div>
      </nav>

      <div style={{ maxWidth: '660px', margin: '0 auto', padding: `${isMobile ? '20px' : '36px'} ${pad}` }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: isMobile ? '24px' : '28px', marginBottom: '5px', color: '#1C1830' }}>Edit drop</div>
        <div style={{ fontSize: '14px', color: '#6B6485', marginBottom: '20px' }}>
          <a href={`https://picdrop.live/drop/${slug}`} target="_blank" rel="noopener noreferrer" style={{ color: '#6040C8', textDecoration: 'none' }}>
            picdrop.live/drop/{slug}
          </a>
          {' '}· {getDaysLeft()} days left
        </div>

        {message && (
          <div style={{ background: '#E1F5EE', color: '#0F6E56', padding: '10px 14px', borderRadius: '9px', fontSize: '13px', marginBottom: '16px' }}>
            ✓ {message}
          </div>
        )}

        {/* DETAILS */}
        <div style={cardStyle}>
          <div style={secLabel}>Details</div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: '#1C1830' }}>Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: '#1C1830' }}>Caption</label>
            <textarea value={caption} onChange={e => setCaption(e.target.value)}
              style={{ ...inputStyle, resize: 'vertical', minHeight: '74px' }} />
          </div>
        </div>

        {/* PHOTOS */}
        <div style={cardStyle}>
          <div style={secLabel}>Photos ({photos.length})</div>
          <label style={{ display: 'block', border: '2px dashed rgba(83,74,183,0.25)', borderRadius: '9px', padding: '20px', textAlign: 'center', cursor: 'pointer', marginBottom: '14px' }}>
            <input type="file" accept="image/*" multiple onChange={handleAddPhotos} style={{ display: 'none' }} />
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>📷</div>
            <div style={{ fontSize: '13px', fontWeight: '500', color: '#1C1830' }}>
              {uploading ? 'Uploading...' : 'Tap to add more photos'}
            </div>
          </label>
          {photos.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '6px' }}>
              {photos.map((p, i) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: '7px', overflow: 'hidden' }}>
                  <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div onClick={() => handleDeletePhoto(p)} style={{ position: 'absolute', top: '4px', right: '4px', width: '22px', height: '22px', background: 'rgba(163,45,45,0.85)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '12px', color: 'white' }}>×</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#6B6485', fontSize: '13px', padding: '20px' }}>No photos yet</div>
          )}
        </div>

        {/* VIBE */}
        <div style={cardStyle}>
          <div style={secLabel}>Vibe</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
            {vibes.map(v => (
              <div key={v.id} onClick={() => setVibe(v.id)} style={{ border: `2px solid ${vibe === v.id ? '#6040C8' : 'rgba(83,74,183,0.15)'}`, borderRadius: '10px', padding: '10px', cursor: 'pointer', background: vibe === v.id ? '#EDE9F9' : 'white', transition: 'all .15s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px' }}>{v.emoji}</span>
                  <span style={{ fontSize: '11px', fontWeight: '500', color: '#1C1830' }}>{v.name}</span>
                </div>
                <div style={{ height: '12px', borderRadius: '3px', background: v.bg, border: '1px solid rgba(0,0,0,0.1)' }} />
              </div>
            ))}
          </div>

          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: '#1C1830' }}>Photo spacing</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'tight', label: 'Tight', desc: 'No gaps' },
              { id: 'normal', label: 'Normal', desc: 'Small gaps' },
              { id: 'airy', label: 'Airy', desc: 'Lots of space' }
            ].map(s => (
              <div key={s.id} onClick={() => setSpacing(s.id)} style={{ flex: 1, border: `1px solid ${spacing === s.id ? '#6040C8' : 'rgba(83,74,183,0.25)'}`, background: spacing === s.id ? '#EDE9F9' : 'white', borderRadius: '9px', padding: '10px', textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: spacing === s.id ? '#6040C8' : '#1C1830', marginBottom: '2px' }}>{s.label}</div>
                <div style={{ fontSize: '11px', color: '#6B6485' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* EXPIRY */}
        <div style={cardStyle}>
          <div style={secLabel}>Expiry</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '14px', color: '#1C1830' }}>Current expiry</div>
            <div style={{ fontSize: '13px', fontWeight: '500', color: getDaysLeft() <= 3 ? '#A32D2D' : '#0F6E56' }}>
              {getDaysLeft()} day{getDaysLeft() !== 1 ? 's' : ''} left
            </div>
          </div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: '#1C1830' }}>Extend by</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {[0, 7, 14, 30].map(d => (
              <div key={d} onClick={() => setExtendDays(d)} style={{ border: `1px solid ${extendDays === d ? '#6040C8' : 'rgba(83,74,183,0.25)'}`, background: extendDays === d ? '#EDE9F9' : 'white', borderRadius: '9px', padding: '10px', textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '14px', fontFamily: 'Georgia, serif', color: '#6040C8' }}>{d === 0 ? '—' : `+${d}`}</div>
                <div style={{ fontSize: '10px', color: '#6B6485', marginTop: '2px' }}>{d === 0 ? 'no change' : 'days'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* OPTIONS */}
        <div style={cardStyle}>
          <div style={secLabel}>Options</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(83,74,183,0.1)' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#1C1830' }}>Password protection</div>
              <div style={{ fontSize: '12px', color: '#6B6485', marginTop: '2px' }}>Require a password before viewing</div>
            </div>
            <Toggle value={hasPassword} onChange={setHasPassword} />
          </div>
          {hasPassword && (
            <div style={{ paddingTop: '10px', paddingBottom: '4px' }}>
              <input type="text" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter a password for viewers" style={inputStyle} />
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(83,74,183,0.1)' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#1C1830' }}>Show expiry countdown</div>
              <div style={{ fontSize: '12px', color: '#6B6485', marginTop: '2px' }}>Viewers see how long the link has left</div>
            </div>
            <Toggle value={showExpiry} onChange={setShowExpiry} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#1C1830' }}>Allow download</div>
              <div style={{ fontSize: '12px', color: '#6B6485', marginTop: '2px' }}>Viewers can save photos to their device</div>
            </div>
            <Toggle value={allowDownload} onChange={setAllowDownload} />
          </div>
        </div>

        {/* ACTIONS */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={handleSave} disabled={saving} style={{ background: '#6040C8', color: 'white', fontSize: '14px', fontWeight: '500', padding: '12px 24px', borderRadius: '9px', border: 'none', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving...' : 'Save all changes'}
          </button>
          <button onClick={() => window.location.href = `/drop/${slug}`} style={{ background: '#EDE9F9', color: '#6040C8', fontSize: '14px', fontWeight: '500', padding: '12px 20px', borderRadius: '9px', border: 'none', cursor: 'pointer' }}>
            View drop
          </button>
          <button onClick={() => window.location.href = '/dashboard'} style={{ background: 'white', color: '#1C1830', fontSize: '14px', padding: '12px 20px', borderRadius: '9px', border: '1px solid rgba(83,74,183,0.25)', cursor: 'pointer' }}>
            Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}