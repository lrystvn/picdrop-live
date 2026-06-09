'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../supabase'

const PicdropLogo = ({ onClick }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '9px', cursor: 'pointer' }} onClick={onClick}>
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
  const [dragIndex, setDragIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const dragItem = useRef(null)
  const dragOverItem = useRef(null)

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
        .from('drops').select('*')
        .eq('slug', slug).eq('user_id', user.id).single()

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
    const { data } = await supabase
      .from('photos').select('*').eq('drop_id', dropId)
      .order('order_index', { ascending: true })
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
    const startIndex = photos.length

    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE)
      const results = await Promise.all(
        batch.map(async (file, batchIdx) => {
          const fileExt = file.name.split('.').pop()
          const fileName = `${drop.id}/${Date.now()}-${Math.random().toString(36).substr(2,6)}.${fileExt}`
          const { error } = await supabase.storage.from('photos').upload(fileName, file)
          if (!error) return { drop_id: drop.id, file_path: fileName, caption: '', order_index: startIndex + i + batchIdx }
          return null
        })
      )
      photoRecords.push(...results.filter(Boolean))
    }

    if (photoRecords.length > 0) await supabase.from('photos').insert(photoRecords)
    await loadPhotos(drop.id)
    setUploading(false)
    setMessage(`${photoRecords.length} photo${photoRecords.length !== 1 ? 's' : ''} added!`)
    setTimeout(() => setMessage(''), 2500)
  }

  const handleDeletePhoto = async (photo) => {
    if (!confirm('Delete this photo?')) return
    await supabase.storage.from('photos').remove([photo.file_path])
    await supabase.from('photos').delete().eq('id', photo.id)
    setPhotos(prev => prev.filter(p => p.id !== photo.id))
  }

  // Drag handlers
  const handleDragStart = (index) => {
    dragItem.current = index
    setDragIndex(index)
  }

  const handleDragEnter = (index) => {
    dragOverItem.current = index
    setDragOverIndex(index)
  }

  const handleDragEnd = async () => {
    if (dragItem.current === null || dragOverItem.current === null) return
    if (dragItem.current === dragOverItem.current) {
      setDragIndex(null); setDragOverIndex(null); return
    }
    const newPhotos = [...photos]
    const dragged = newPhotos.splice(dragItem.current, 1)[0]
    newPhotos.splice(dragOverItem.current, 0, dragged)
    setPhotos(newPhotos)
    dragItem.current = null
    dragOverItem.current = null
    setDragIndex(null)
    setDragOverIndex(null)

    // Save new order to database
    await Promise.all(
      newPhotos.map((p, i) =>
        supabase.from('photos').update({ order_index: i }).eq('id', p.id)
      )
    )
    setMessage('Order saved!')
    setTimeout(() => setMessage(''), 1500)
  }

  const getDaysLeft = () => {
    if (!drop) return 0
    return Math.ceil((new Date(drop.expires_at) - new Date()) / (1000 * 60 * 60 * 24))
  }

  const handleSave = async () => {
    setSaving(true)
    const updates = {
      title, caption, vibe, spacing,
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
    setTimeout(() => setMessage(''), 2500)
    if (extendDays > 0) setExtendDays(0)
  }

  const pad = isMobile ? '16px' : '24px'
  const cardStyle = { background: '#fff', border: '1px solid rgba(83,74,183,0.1)', borderRadius: '16px', padding: isMobile ? '18px' : '24px', marginBottom: '12px' }
  const secLabel = { fontSize: '11px', fontWeight: '600', color: '#6040C8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }
  const inputStyle = { width: '100%', padding: '11px 13px', border: '1px solid rgba(83,74,183,0.18)', borderRadius: '9px', fontSize: '15px', fontFamily: 'sans-serif', outline: 'none', boxSizing: 'border-box', color: '#1C1830', background: '#FAFAFA' }

  const Toggle = ({ value, onChange }) => (
    <div onClick={() => onChange(!value)} style={{ width: '42px', height: '24px', borderRadius: '99px', cursor: 'pointer', background: value ? '#6040C8' : '#D3D1C7', position: 'relative', transition: 'background .2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: '3px', left: value ? '21px' : '3px', width: '18px', height: '18px', background: 'white', borderRadius: '50%', transition: 'left .2s' }} />
    </div>
  )

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F2F0F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#9B9BA8', fontSize: '14px' }}>Loading...</div>
    </div>
  )

  const daysLeft = getDaysLeft()
  const urgent = daysLeft <= 3

  return (
    <div style={{ minHeight: '100vh', background: '#F2F0F8', fontFamily: 'sans-serif' }}>

      {/* NAV */}
      <nav style={{
        background: 'rgba(28,24,48,0.96)', backdropFilter: 'blur(12px)',
        padding: `0 ${pad}`, height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <PicdropLogo onClick={() => window.location.href = '/'} />
        <div onClick={() => window.location.href = '/dashboard'} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
          ← Dashboard
        </div>
      </nav>

      <div style={{ maxWidth: '660px', margin: '0 auto', padding: `${isMobile ? '24px' : '40px'} ${pad}` }}>

        {/* PAGE HEADER */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: isMobile ? '26px' : '32px', color: '#1C1830', letterSpacing: '-0.02em', marginBottom: '6px' }}>
            Edit drop
          </div>
          <div style={{ fontSize: '14px', color: '#6B6485', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <a href={`https://picdrop.live/drop/${slug}`} target="_blank" rel="noopener noreferrer" style={{ color: '#6040C8', textDecoration: 'none' }}>
              picdrop.live/drop/{slug}
            </a>
            <span style={{ color: '#D3D1C7' }}>·</span>
            <span style={{ color: urgent ? '#DC2626' : '#6B6485', fontWeight: urgent ? '500' : '400' }}>
              {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
            </span>
          </div>
        </div>

        {/* MESSAGE */}
        {message && (
          <div style={{ background: '#E1F5EE', color: '#0F6E56', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ✓ {message}
          </div>
        )}

        {/* DETAILS */}
        <div style={cardStyle}>
          <div style={secLabel}>Details</div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '7px', color: '#1C1830' }}>Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '7px', color: '#1C1830' }}>
              Caption <span style={{ color: '#9B9BA8', fontWeight: '400' }}>(optional)</span>
            </label>
            <textarea value={caption} onChange={e => setCaption(e.target.value)}
              style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} />
          </div>
        </div>

        {/* PHOTOS */}
        <div style={cardStyle}>
          <div style={{ ...secLabel, marginBottom: '6px' }}>Photos ({photos.length})</div>
          <div style={{ fontSize: '12px', color: '#9B9BA8', marginBottom: '14px' }}>
            Drag to reorder · first photo is the cover
          </div>

          <label style={{ display: 'block', border: '2px dashed rgba(83,74,183,0.18)', borderRadius: '12px', padding: '18px', textAlign: 'center', cursor: 'pointer', marginBottom: '14px', background: '#FAFAFA' }}>
            <input type="file" accept="image/*" multiple onChange={handleAddPhotos} style={{ display: 'none' }} />
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>📷</div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1C1830' }}>
              {uploading ? 'Uploading...' : 'Tap to add more photos'}
            </div>
          </label>

          {photos.length > 0 ? (
            <div style={{ display: 'grid', gap: '8px' }}>
              {photos.map((p, i) => (
                <div
                  key={p.id}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragEnter={() => handleDragEnter(i)}
                  onDragEnd={handleDragEnd}
                  onDragOver={e => e.preventDefault()}
                  style={{
                    display: 'flex', gap: '12px', alignItems: 'center',
                    padding: '8px', borderRadius: '10px',
                    background: dragOverIndex === i && dragIndex !== i ? 'rgba(96,64,200,0.08)' : 'transparent',
                    border: dragOverIndex === i && dragIndex !== i ? '1px solid rgba(96,64,200,0.25)' : '1px solid transparent',
                    opacity: dragIndex === i ? 0.4 : 1,
                    transition: 'all .15s',
                    cursor: 'grab'
                  }}
                >
                  {/* DRAG HANDLE */}
                  <div style={{ flexShrink: 0, cursor: 'grab' }}>
                    <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
                      <circle cx="4" cy="4" r="1.5" fill="#D3D1C7"/>
                      <circle cx="4" cy="10" r="1.5" fill="#D3D1C7"/>
                      <circle cx="4" cy="16" r="1.5" fill="#D3D1C7"/>
                      <circle cx="10" cy="4" r="1.5" fill="#D3D1C7"/>
                      <circle cx="10" cy="10" r="1.5" fill="#D3D1C7"/>
                      <circle cx="10" cy="16" r="1.5" fill="#D3D1C7"/>
                    </svg>
                  </div>

                  {/* PHOTO */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden' }}>
                      <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    {i === 0 && (
                      <div style={{ position: 'absolute', bottom: '3px', left: '3px', fontSize: '9px', fontWeight: '600', background: 'rgba(96,64,200,0.9)', color: 'white', padding: '2px 5px', borderRadius: '4px', letterSpacing: '0.04em' }}>
                        COVER
                      </div>
                    )}
                  </div>

                  {/* FILE INFO */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', color: '#9B9BA8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.file_path.split('/').pop()}
                    </div>
                    {i === 0 && (
                      <div style={{ fontSize: '11px', color: '#6040C8', marginTop: '2px' }}>Cover photo</div>
                    )}
                  </div>

                  {/* DELETE */}
                  <div onClick={() => handleDeletePhoto(p)} style={{ width: '28px', height: '28px', background: '#FEF2F2', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, fontSize: '14px', color: '#DC2626' }}>
                    ×
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#9B9BA8', fontSize: '13px', padding: '20px' }}>No photos yet</div>
          )}
        </div>

        {/* VIBE */}
        <div style={cardStyle}>
          <div style={secLabel}>Vibe</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '18px' }}>
            {vibes.map(v => (
              <div key={v.id} onClick={() => setVibe(v.id)} style={{
                border: `1.5px solid ${vibe === v.id ? '#6040C8' : 'rgba(83,74,183,0.12)'}`,
                borderRadius: '12px', padding: '12px', cursor: 'pointer',
                background: vibe === v.id ? '#EDE9F9' : '#FAFAFA', transition: 'all .15s'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px' }}>{v.emoji}</span>
                  <span style={{ fontSize: '11px', fontWeight: '500', color: '#1C1830' }}>{v.name}</span>
                </div>
                <div style={{ height: '12px', borderRadius: '3px', background: v.bg, border: '1px solid rgba(0,0,0,0.08)' }} />
              </div>
            ))}
          </div>

          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '10px', color: '#1C1830' }}>Photo spacing</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'tight', label: 'Tight', desc: 'No gaps' },
              { id: 'normal', label: 'Normal', desc: 'Small gaps' },
              { id: 'airy', label: 'Airy', desc: 'Spaced out' }
            ].map(s => (
              <div key={s.id} onClick={() => setSpacing(s.id)} style={{
                flex: 1, border: `1px solid ${spacing === s.id ? '#6040C8' : 'rgba(83,74,183,0.18)'}`,
                background: spacing === s.id ? '#EDE9F9' : '#FAFAFA',
                borderRadius: '9px', padding: '10px', textAlign: 'center', cursor: 'pointer', transition: 'all .15s'
              }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: spacing === s.id ? '#6040C8' : '#1C1830', marginBottom: '2px' }}>{s.label}</div>
                <div style={{ fontSize: '11px', color: '#9B9BA8' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* EXPIRY */}
        <div style={cardStyle}>
          <div style={secLabel}>Expiry</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', color: '#1C1830' }}>Time remaining</div>
            <div style={{ fontSize: '13px', fontWeight: '500', color: urgent ? '#DC2626' : '#0F6E56', background: urgent ? '#FEF2F2' : '#E1F5EE', padding: '4px 12px', borderRadius: '99px' }}>
              {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
            </div>
          </div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '10px', color: '#1C1830' }}>Extend by</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {[0, 7, 14, 30].map(d => (
              <div key={d} onClick={() => setExtendDays(d)} style={{
                border: `1px solid ${extendDays === d ? '#6040C8' : 'rgba(83,74,183,0.18)'}`,
                background: extendDays === d ? '#EDE9F9' : '#FAFAFA',
                borderRadius: '10px', padding: '12px', textAlign: 'center', cursor: 'pointer', transition: 'all .15s'
              }}>
                <div style={{ fontSize: '15px', fontFamily: 'Georgia, serif', color: '#6040C8' }}>{d === 0 ? '—' : `+${d}`}</div>
                <div style={{ fontSize: '10px', color: '#9B9BA8', marginTop: '3px' }}>{d === 0 ? 'no change' : 'days'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* OPTIONS */}
        <div style={cardStyle}>
          <div style={secLabel}>Options</div>
          {[
            { label: 'Password protection', desc: 'Require a password before viewing', value: hasPassword, onChange: setHasPassword },
            { label: 'Show expiry countdown', desc: 'Viewers see how long the link has left', value: showExpiry, onChange: setShowExpiry },
            { label: 'Allow download', desc: 'Viewers can save photos to their device', value: allowDownload, onChange: setAllowDownload }
          ].map((opt, i, arr) => (
            <div key={opt.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(83,74,183,0.08)' : 'none' }}>
                <div>
                  <div style={{ fontSize: '14px', color: '#1C1830' }}>{opt.label}</div>
                  <div style={{ fontSize: '12px', color: '#9B9BA8', marginTop: '2px' }}>{opt.desc}</div>
                </div>
                <Toggle value={opt.value} onChange={opt.onChange} />
              </div>
              {opt.label === 'Password protection' && hasPassword && (
                <div style={{ paddingBottom: '8px' }}>
                  <input type="text" value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Enter a password for viewers" style={inputStyle} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingBottom: '40px' }}>
          <button onClick={handleSave} disabled={saving} style={{
            background: '#6040C8', color: 'white', fontSize: '15px', fontWeight: '500',
            padding: '13px 28px', borderRadius: '10px', border: 'none', cursor: 'pointer',
            opacity: saving ? 0.7 : 1, letterSpacing: '-0.01em'
          }}>
            {saving ? 'Saving...' : 'Save all changes'}
          </button>
          <button onClick={() => window.location.href = `/drop/${slug}`} style={{
            background: '#EDE9F9', color: '#6040C8', fontSize: '15px', fontWeight: '500',
            padding: '13px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer'
          }}>
            View drop
          </button>
          <button onClick={() => window.location.href = '/dashboard'} style={{
            background: 'white', color: '#6B6485', fontSize: '15px',
            padding: '13px 20px', borderRadius: '10px',
            border: '1px solid rgba(83,74,183,0.15)', cursor: 'pointer'
          }}>
            Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}