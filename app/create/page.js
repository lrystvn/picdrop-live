'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabase'

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

export default function Create() {
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [slug, setSlug] = useState('')
  const [expiry, setExpiry] = useState(14)
  const [password, setPassword] = useState('')
  const [hasPassword, setHasPassword] = useState(false)
  const [allowDownload, setAllowDownload] = useState(false)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingPhotos, setLoadingPhotos] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 })
  const [slugStatus, setSlugStatus] = useState('')
  const [vibe, setVibe] = useState('electric')
  const [spacing, setSpacing] = useState('normal')
  const [showExpiry, setShowExpiry] = useState(true)
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
    { id: 'electric', emoji: '💜', name: 'Electric', desc: 'Bold purple, high contrast', bg: '#1C1830', accent: '#9B8FE4', font: 'Georgia, serif', layout: 'grid3' },
    { id: 'clean', emoji: '🤍', name: 'Clean & Simple', desc: 'White background, airy', bg: '#F8F8F8', accent: '#333333', font: 'DM Sans, sans-serif', layout: 'grid3' },
    { id: 'darkroom', emoji: '🖤', name: 'Dark Room', desc: 'Moody dark, minimal', bg: '#111111', accent: '#ffffff', font: 'Georgia, serif', layout: 'grid3' },
    { id: 'earthy', emoji: '🌿', name: 'Earthy', desc: 'Warm green tones', bg: '#1A2E1A', accent: '#7DBF7D', font: 'Georgia, serif', layout: 'masonry' },
    { id: 'ocean', emoji: '🌊', name: 'Ocean', desc: 'Deep blue, calm', bg: '#0A1628', accent: '#4A9EDB', font: 'DM Sans, sans-serif', layout: 'grid2' },
    { id: 'film', emoji: '🎞️', name: 'Film Roll', desc: 'Retro, warm tones', bg: '#1C1410', accent: '#D4A853', font: 'Space Mono, monospace', layout: 'grid3' },
  ]

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    setLoadingPhotos(true)
    const newPhotos = files.map(file => ({
      file, url: URL.createObjectURL(file), name: file.name, caption: ''
    }))
    setTimeout(() => {
      setPhotos(prev => [...prev, ...newPhotos])
      setLoadingPhotos(false)
    }, 50)
  }

  const removePhoto = (index) => setPhotos(prev => prev.filter((_, i) => i !== index))

  const updatePhotoCaption = (index, value) => {
    setPhotos(prev => prev.map((p, i) => i === index ? { ...p, caption: value } : p))
  }

  // Drag and drop handlers
  const handleDragStart = (index) => {
    dragItem.current = index
    setDragIndex(index)
  }

  const handleDragEnter = (index) => {
    dragOverItem.current = index
    setDragOverIndex(index)
  }

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return
    if (dragItem.current === dragOverItem.current) {
      setDragIndex(null)
      setDragOverIndex(null)
      return
    }
    const newPhotos = [...photos]
    const dragged = newPhotos.splice(dragItem.current, 1)[0]
    newPhotos.splice(dragOverItem.current, 0, dragged)
    setPhotos(newPhotos)
    dragItem.current = null
    dragOverItem.current = null
    setDragIndex(null)
    setDragOverIndex(null)
  }

  const checkSlug = async (val) => {
    setSlug(val)
    if (!val) { setSlugStatus(''); return }
    const { data } = await supabase.from('drops').select('slug').eq('slug', val.toLowerCase()).single()
    if (data) setSlugStatus('taken')
    else setSlugStatus('available')
  }

  const handlePublish = async () => {
    if (!title) { alert('Please add a title'); return }
    if (!slug) { alert('Please add a slug'); return }
    if (photos.length === 0) { alert('Please add at least one photo'); return }
    if (photos.length > 50) { alert('Maximum 50 photos per drop.'); return }
    setLoading(true)
    setUploadProgress({ current: 0, total: photos.length })

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }

      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + expiry)
      const selectedVibe = vibes.find(v => v.id === vibe)

      const { data: drop, error: dropError } = await supabase
        .from('drops')
        .insert({
          title, caption, slug,
          expires_at: expiresAt.toISOString(),
          password: hasPassword ? password : null,
          user_id: user.id,
          view_count: 0,
          vibe,
          theme: selectedVibe.accent,
          font: selectedVibe.font,
          layout: selectedVibe.layout,
          spacing,
          show_expiry: showExpiry,
          allow_download: allowDownload
        })
        .select()
        .single()

      if (dropError) { alert('Drop error: ' + dropError.message); setLoading(false); return }

      const BATCH_SIZE = 5
      let completed = 0
      const photoRecords = []

      for (let i = 0; i < photos.length; i += BATCH_SIZE) {
        const batch = photos.slice(i, i + BATCH_SIZE)
        const batchResults = await Promise.all(
          batch.map(async (photo, batchIdx) => {
            const globalIndex = i + batchIdx
            const fileExt = photo.name.split('.').pop()
            const fileName = `${drop.id}/${Date.now()}-${Math.random().toString(36).substr(2,6)}.${fileExt}`
            const { error: uploadError } = await supabase.storage.from('photos').upload(fileName, photo.file)
            if (uploadError) throw new Error('Upload error: ' + uploadError.message)
            completed++
            setUploadProgress({ current: completed, total: photos.length })
            return { drop_id: drop.id, file_path: fileName, caption: photo.caption || '', order_index: globalIndex }
          })
        )
        photoRecords.push(...batchResults)
      }

      const { error: photoError } = await supabase.from('photos').insert(photoRecords)
      if (photoError) throw new Error('Photo record error: ' + photoError.message)

      window.location.href = `/drop/${slug}`
    } catch (err) {
      alert('Something went wrong: ' + err.message)
      setLoading(false)
      setUploadProgress({ current: 0, total: 0 })
    }
  }

  const selectedVibe = vibes.find(v => v.id === vibe)
  const pad = isMobile ? '16px' : '24px'

  const cardStyle = {
    background: '#fff', border: '1px solid rgba(83,74,183,0.1)',
    borderRadius: '16px', padding: isMobile ? '18px' : '24px', marginBottom: '12px'
  }
  const secLabel = {
    fontSize: '11px', fontWeight: '600', color: '#6040C8',
    letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px'
  }
  const inputStyle = {
    width: '100%', padding: '11px 13px', border: '1px solid rgba(83,74,183,0.18)',
    borderRadius: '9px', fontSize: '15px', fontFamily: 'sans-serif', outline: 'none',
    boxSizing: 'border-box', color: '#1C1830', background: '#FAFAFA'
  }

  const Toggle = ({ value, onChange }) => (
    <div onClick={() => onChange(!value)} style={{ width: '42px', height: '24px', borderRadius: '99px', cursor: 'pointer', background: value ? '#6040C8' : '#D3D1C7', position: 'relative', transition: 'background .2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: '3px', left: value ? '21px' : '3px', width: '18px', height: '18px', background: 'white', borderRadius: '50%', transition: 'left .2s' }} />
    </div>
  )

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#1C1830', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '320px', width: '100%' }}>
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
          <PicdropLogo onClick={() => {}} />
        </div>
        <div style={{ fontSize: '20px', color: '#fff', fontFamily: 'Georgia, serif', marginBottom: '8px', letterSpacing: '-0.01em' }}>
          {uploadProgress.current === 0 ? 'Creating your drop...' : 'Uploading photos...'}
        </div>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginBottom: '28px' }}>
          {uploadProgress.total > 0 && uploadProgress.current > 0
            ? `${uploadProgress.current} of ${uploadProgress.total} photos uploaded`
            : 'Just a moment...'}
        </div>
        {uploadProgress.total > 0 && (
          <>
            <div style={{ height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden', marginBottom: '10px' }}>
              <div style={{ height: '100%', width: `${(uploadProgress.current / uploadProgress.total) * 100}%`, background: '#9B8FE4', borderRadius: '99px', transition: 'width .3s ease' }} />
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
              {Math.round((uploadProgress.current / uploadProgress.total) * 100)}%
            </div>
          </>
        )}
        <div style={{ marginTop: '36px', fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>Don't close this page</div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F2F0F8', fontFamily: 'sans-serif' }}>
      <nav style={{
        background: 'rgba(28,24,48,0.96)', backdropFilter: 'blur(12px)',
        padding: `0 ${pad}`, height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <PicdropLogo onClick={() => window.location.href = '/'} />
        <div onClick={() => window.location.href = '/dashboard'} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
          ← {isMobile ? 'Back' : 'Dashboard'}
        </div>
      </nav>

      <div style={{ maxWidth: '660px', margin: '0 auto', padding: `${isMobile ? '24px' : '40px'} ${pad}` }}>
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: isMobile ? '26px' : '32px', color: '#1C1830', letterSpacing: '-0.02em', marginBottom: '6px' }}>
            New photo drop
          </div>
          <div style={{ fontSize: '14px', color: '#6B6485', lineHeight: 1.5 }}>
            Upload your photos, pick a vibe, set your link. Done in minutes.
          </div>
        </div>

        {/* PHOTOS */}
        <div style={cardStyle}>
          <div style={secLabel}>Photos</div>
          <label style={{
            display: 'block', border: '2px dashed rgba(83,74,183,0.2)',
            borderRadius: '12px', padding: isMobile ? '28px 16px' : '36px 20px',
            textAlign: 'center', cursor: 'pointer', background: '#FAFAFA'
          }}>
            <input type="file" accept="image/*" multiple onChange={handlePhotos} style={{ display: 'none' }} />
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>📷</div>
            <div style={{ fontSize: '15px', fontWeight: '500', marginBottom: '4px', color: '#1C1830' }}>
              {isMobile ? 'Tap to add photos' : 'Click to upload photos'}
            </div>
            <div style={{ fontSize: '12px', color: '#9B9BA8' }}>
              {isMobile ? 'Camera roll · max 50 photos' : 'JPG, PNG, HEIC · max 50 photos'}
            </div>
          </label>

          {loadingPhotos && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#6040C8', fontSize: '14px' }}>
              ⏳ Loading your photos...
            </div>
          )}

          {!loadingPhotos && photos.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '12px', color: '#9B9BA8', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{photos.length} photo{photos.length !== 1 ? 's' : ''} · <span style={{ color: '#6040C8' }}>drag to reorder</span></span>
                <span style={{ color: photos.length >= 45 ? '#DC2626' : '#9B9BA8', fontWeight: photos.length >= 45 ? '500' : '400' }}>{photos.length}/50</span>
              </div>
              <div style={{ display: 'grid', gap: '8px' }}>
                {photos.map((p, i) => (
                  <div
                    key={i}
                    draggable
                    onDragStart={() => handleDragStart(i)}
                    onDragEnter={() => handleDragEnter(i)}
                    onDragEnd={handleDragEnd}
                    onDragOver={e => e.preventDefault()}
                    style={{
                      display: 'flex', gap: '12px', alignItems: 'flex-start',
                      padding: '8px', borderRadius: '10px',
                      background: dragOverIndex === i && dragIndex !== i ? 'rgba(96,64,200,0.08)' : 'transparent',
                      border: dragOverIndex === i && dragIndex !== i ? '1px solid rgba(96,64,200,0.25)' : '1px solid transparent',
                      opacity: dragIndex === i ? 0.4 : 1,
                      transition: 'all .15s',
                      cursor: 'grab'
                    }}
                  >
                    {/* DRAG HANDLE */}
                    <div style={{ display: 'flex', alignItems: 'center', paddingTop: '4px', flexShrink: 0, cursor: 'grab' }}>
                      <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
                        <circle cx="4" cy="4" r="1.5" fill="#D3D1C7"/>
                        <circle cx="4" cy="10" r="1.5" fill="#D3D1C7"/>
                        <circle cx="4" cy="16" r="1.5" fill="#D3D1C7"/>
                        <circle cx="10" cy="4" r="1.5" fill="#D3D1C7"/>
                        <circle cx="10" cy="10" r="1.5" fill="#D3D1C7"/>
                        <circle cx="10" cy="16" r="1.5" fill="#D3D1C7"/>
                      </svg>
                    </div>

                    {/* PHOTO + INDEX */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{ width: isMobile ? '64px' : '72px', height: isMobile ? '64px' : '72px', borderRadius: '9px', overflow: 'hidden' }}>
                        <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      {i === 0 && (
                        <div style={{ position: 'absolute', bottom: '3px', left: '3px', fontSize: '9px', fontWeight: '600', background: 'rgba(96,64,200,0.9)', color: 'white', padding: '2px 5px', borderRadius: '4px', letterSpacing: '0.04em' }}>
                          COVER
                        </div>
                      )}
                      <div onClick={() => removePhoto(i)} style={{ position: 'absolute', top: '3px', right: '3px', width: '18px', height: '18px', background: 'rgba(0,0,0,0.6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '10px', color: 'white' }}>×</div>
                    </div>

                    {/* CAPTION */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '11px', color: '#9B9BA8', marginBottom: '5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.name}
                      </div>
                      <input
                        type="text"
                        placeholder="Add a caption (optional)"
                        value={p.caption}
                        onChange={e => updatePhotoCaption(i, e.target.value)}
                        onMouseDown={e => e.stopPropagation()}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid rgba(83,74,183,0.15)', borderRadius: '7px', fontSize: '13px', fontFamily: 'sans-serif', outline: 'none', boxSizing: 'border-box', color: '#1C1830', background: '#FAFAFA' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '11px', color: '#9B9BA8', marginTop: '10px', textAlign: 'center' }}>
                First photo becomes the cover image
              </div>
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div style={cardStyle}>
          <div style={secLabel}>Details</div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '7px', color: '#1C1830' }}>Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Team Offsite June 2026" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '7px', color: '#1C1830' }}>Caption <span style={{ color: '#9B9BA8', fontWeight: '400' }}>(optional)</span></label>
            <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="A short message for your viewers..."
              style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} />
          </div>
        </div>

        {/* LINK */}
        <div style={cardStyle}>
          <div style={secLabel}>Your link</div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '7px', color: '#1C1830' }}>Custom slug</label>
            {isMobile ? (
              <div>
                <div style={{ fontSize: '12px', color: '#9B9BA8', marginBottom: '6px', fontFamily: 'monospace' }}>picdrop.live/drop/</div>
                <input type="text" value={slug} onChange={e => checkSlug(e.target.value)} placeholder="yourslug"
                  style={{ ...inputStyle, fontFamily: 'monospace' }} />
              </div>
            ) : (
              <div style={{ display: 'flex' }}>
                <div style={{ fontSize: '12px', color: '#6B6485', background: '#EDE9F9', border: '1px solid rgba(83,74,183,0.18)', borderRight: 'none', padding: '11px 12px', borderRadius: '9px 0 0 9px', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                  picdrop.live/drop/
                </div>
                <input type="text" value={slug} onChange={e => checkSlug(e.target.value)} placeholder="yourslug"
                  style={{ flex: 1, padding: '11px 13px', border: '1px solid rgba(83,74,183,0.18)', borderRadius: '0 9px 9px 0', fontSize: '14px', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box', background: '#FAFAFA', color: '#1C1830' }} />
              </div>
            )}
            {slugStatus && (
              <div style={{ fontSize: '12px', marginTop: '6px', color: slugStatus === 'available' ? '#0F6E56' : '#DC2626' }}>
                {slugStatus === 'available' ? '✓ Available' : '✗ Already taken'}
              </div>
            )}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '10px', color: '#1C1830' }}>Expires after</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[7, 14, 30].map(d => (
                <div key={d} onClick={() => setExpiry(d)} style={{
                  border: `1px solid ${expiry === d ? '#6040C8' : 'rgba(83,74,183,0.18)'}`,
                  background: expiry === d ? '#EDE9F9' : '#FAFAFA',
                  borderRadius: '10px', padding: '14px 12px', textAlign: 'center', cursor: 'pointer', transition: 'all .15s'
                }}>
                  <div style={{ fontSize: '20px', fontFamily: 'Georgia, serif', color: '#6040C8' }}>{d}</div>
                  <div style={{ fontSize: '11px', color: '#9B9BA8', marginTop: '2px' }}>days</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* VIBE */}
        <div style={cardStyle}>
          <div style={secLabel}>Choose a vibe</div>
          <div style={{ fontSize: '13px', color: '#6B6485', marginBottom: '16px', lineHeight: 1.5 }}>
            Sets the whole look and feel of your drop page.
          </div>
          <div style={{ background: selectedVibe.bg, borderRadius: '12px', padding: '16px', marginBottom: '16px', border: '1px solid rgba(0,0,0,0.08)' }}>
            <div style={{ fontFamily: selectedVibe.font, fontSize: '15px', color: selectedVibe.accent, marginBottom: '10px', opacity: 0.9 }}>
              Preview — {selectedVibe.name}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing === 'tight' ? '0px' : spacing === 'airy' ? '8px' : '3px', borderRadius: '8px', overflow: 'hidden' }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ aspectRatio: '1', background: `${selectedVibe.accent}33`, borderRadius: spacing === 'airy' ? '4px' : '0px' }} />
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
            {vibes.map(v => (
              <div key={v.id} onClick={() => setVibe(v.id)} style={{
                border: `1.5px solid ${vibe === v.id ? '#6040C8' : 'rgba(83,74,183,0.12)'}`,
                borderRadius: '12px', padding: '12px', cursor: 'pointer',
                background: vibe === v.id ? '#EDE9F9' : '#FAFAFA', transition: 'all .15s'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                  <span style={{ fontSize: '16px' }}>{v.emoji}</span>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: '#1C1830' }}>{v.name}</span>
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

        {/* PUBLISH */}
        <div style={{ display: 'flex', gap: '10px', flexDirection: isMobile ? 'column' : 'row', paddingBottom: '40px' }}>
          <button onClick={handlePublish} disabled={loading} style={{
            background: '#6040C8', color: 'white', fontSize: '15px', fontWeight: '500',
            padding: '14px 32px', borderRadius: '10px', border: 'none', cursor: 'pointer',
            opacity: loading ? 0.7 : 1, letterSpacing: '-0.01em'
          }}>
            Publish drop
          </button>
          <button onClick={() => window.location.href = '/dashboard'} style={{
            background: 'white', color: '#6B6485', fontSize: '15px',
            padding: '14px 24px', borderRadius: '10px',
            border: '1px solid rgba(83,74,183,0.15)', cursor: 'pointer'
          }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}