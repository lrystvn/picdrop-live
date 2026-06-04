'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { supabase } from '../supabase'

export default function Create() {
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [slug, setSlug] = useState('')
  const [expiry, setExpiry] = useState(14)
  const [password, setPassword] = useState('')
  const [hasPassword, setHasPassword] = useState(false)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [slugStatus, setSlugStatus] = useState('')

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files)
    const previews = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }))
    setPhotos(prev => [...prev, ...previews])
  }

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const checkSlug = (val) => {
    setSlug(val)
    const taken = ['test', 'photos', 'vacation', 'mytrip']
    if (!val) { setSlugStatus(''); return }
    if (taken.includes(val.toLowerCase())) {
      setSlugStatus('taken')
    } else {
      setSlugStatus('available')
    }
  }

  const handlePublish = async () => {
    if (!title) { alert('Please add a title'); return }
    if (!slug) { alert('Please add a slug'); return }
    if (photos.length === 0) { alert('Please add at least one photo'); return }
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }

      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + expiry)

      const { data: drop, error: dropError } = await supabase
        .from('drops')
        .insert({
          title,
          caption,
          slug,
          expires_at: expiresAt.toISOString(),
          password: hasPassword ? password : null,
          user_id: user.id,
          view_count: 0
        })
        .select()
        .single()

      if (dropError) {
        alert('Drop error: ' + dropError.message)
        setLoading(false)
        return
      }

      for (const photo of photos) {
        const fileExt = photo.name.split('.').pop()
        const fileName = `${drop.id}/${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(fileName, photo.file)

        if (uploadError) {
          alert('Upload error: ' + uploadError.message)
          setLoading(false)
          return
        }

        await supabase.from('photos').insert({
          drop_id: drop.id,
          file_path: fileName
        })
      }

      window.location.href = `/drop/${slug}`
    } catch (err) {
      alert('Something went wrong: ' + err.message)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F2F0F8', fontFamily: 'sans-serif' }}>
      <nav style={{
        background: '#1C1830', padding: '0 28px', height: '56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div onClick={() => window.location.href = '/'} style={{
          fontFamily: 'Georgia, serif', fontSize: '21px', color: '#ffffff', cursor: 'pointer'
        }}>
          Pic<span style={{ color: '#9B8FE4', fontStyle: 'italic' }}>drop</span>
        </div>
        <div onClick={() => window.location.href = '/dashboard'} style={{
          fontSize: '13px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer'
        }}>
          ← Dashboard
        </div>
      </nav>

      <div style={{ maxWidth: '660px', margin: '0 auto', padding: '36px 24px' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '28px', marginBottom: '5px', color: '#1C1830' }}>
          New photo drop
        </div>
        <div style={{ fontSize: '14px', color: '#6B6485', marginBottom: '28px' }}>
          Upload your photos, customize the page, set your link.
        </div>

        <div style={{
          background: '#fff', border: '1px solid rgba(83,74,183,0.15)',
          borderRadius: '14px', padding: '22px', marginBottom: '12px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: '500', color: '#6040C8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Photos
          </div>
          <label style={{
            display: 'block', border: '2px dashed rgba(83,74,183,0.25)',
            borderRadius: '9px', padding: '40px 20px', textAlign: 'center', cursor: 'pointer'
          }}>
            <input type="file" accept="image/*" multiple onChange={handlePhotos} style={{ display: 'none' }} />
            <div style={{ fontSize: '30px', marginBottom: '8px' }}>📷</div>
            <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#1C1830' }}>
              Click to upload photos
            </div>
            <div style={{ fontSize: '12px', color: '#6B6485' }}>JPG, PNG, HEIC · any number of photos</div>
          </label>

          {photos.length > 0 && (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
              gap: '6px', marginTop: '14px'
            }}>
              {photos.map((p, i) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: '7px', overflow: 'hidden' }}>
                  <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div onClick={() => removePhoto(i)} style={{
                    position: 'absolute', top: '4px', right: '4px',
                    width: '20px', height: '20px', background: 'rgba(0,0,0,0.55)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', fontSize: '11px', color: 'white'
                  }}>×</div>
                </div>
              ))}
            </div>
          )}
          {photos.length > 0 && (
            <div style={{ fontSize: '12px', color: '#6B6485', marginTop: '8px' }}>
              {photos.length} photo{photos.length !== 1 ? 's' : ''} added
            </div>
          )}
        </div>

        <div style={{
          background: '#fff', border: '1px solid rgba(83,74,183,0.15)',
          borderRadius: '14px', padding: '22px', marginBottom: '12px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: '500', color: '#6040C8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Details
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: '#1C1830' }}>Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Cancun Trip 2025"
              style={{ width: '100%', padding: '9px 13px', border: '1px solid rgba(83,74,183,0.25)', borderRadius: '9px', fontSize: '14px', fontFamily: 'sans-serif', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: '#1C1830' }}>Caption (optional)</label>
            <textarea value={caption} onChange={e => setCaption(e.target.value)}
              placeholder="A short message for your viewers..."
              style={{ width: '100%', padding: '9px 13px', border: '1px solid rgba(83,74,183,0.25)', borderRadius: '9px', fontSize: '14px', fontFamily: 'sans-serif', outline: 'none', resize: 'vertical', minHeight: '74px', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{
          background: '#fff', border: '1px solid rgba(83,74,183,0.15)',
          borderRadius: '14px', padding: '22px', marginBottom: '12px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: '500', color: '#6040C8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Your link
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: '#1C1830' }}>Custom slug</label>
            <div style={{ display: 'flex' }}>
              <div style={{
                fontSize: '12px', color: '#6B6485', background: '#EDE9F9',
                border: '1px solid rgba(83,74,183,0.25)', borderRight: 'none',
                padding: '9px 12px', borderRadius: '9px 0 0 9px', whiteSpace: 'nowrap', fontFamily: 'monospace'
              }}>
                picdrop.live/
              </div>
              <input type="text" value={slug} onChange={e => checkSlug(e.target.value)}
                placeholder="yourslug"
                style={{ flex: 1, padding: '9px 13px', border: '1px solid rgba(83,74,183,0.25)', borderRadius: '0 9px 9px 0', fontSize: '13px', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            {slugStatus && (
              <div style={{ fontSize: '12px', marginTop: '5px', color: slugStatus === 'available' ? '#0F6E56' : '#A32D2D' }}>
                {slugStatus === 'available' ? '✓ Available' : '✗ Already taken'}
              </div>
            )}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: '#1C1830' }}>Expires after</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[7, 14, 30].map(d => (
                <div key={d} onClick={() => setExpiry(d)} style={{
                  border: `1px solid ${expiry === d ? '#6040C8' : 'rgba(83,74,183,0.25)'}`,
                  background: expiry === d ? '#EDE9F9' : 'white',
                  borderRadius: '9px', padding: '12px', textAlign: 'center', cursor: 'pointer'
                }}>
                  <div style={{ fontSize: '20px', fontFamily: 'Georgia, serif', color: '#6040C8' }}>{d}</div>
                  <div style={{ fontSize: '11px', color: '#6B6485', marginTop: '2px' }}>days</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          background: '#fff', border: '1px solid rgba(83,74,183,0.15)',
          borderRadius: '14px', padding: '22px', marginBottom: '22px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: '500', color: '#6040C8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Options
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(83,74,183,0.1)' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#1C1830' }}>Password protection</div>
              <div style={{ fontSize: '12px', color: '#6B6485', marginTop: '2px' }}>Require a password before viewing</div>
            </div>
            <div onClick={() => setHasPassword(!hasPassword)} style={{
              width: '38px', height: '22px', borderRadius: '99px', cursor: 'pointer',
              background: hasPassword ? '#6040C8' : '#D3D1C7', position: 'relative', transition: 'background .2s'
            }}>
              <div style={{
                position: 'absolute', top: '3px', left: hasPassword ? '19px' : '3px',
                width: '16px', height: '16px', background: 'white', borderRadius: '50%', transition: 'left .2s'
              }} />
            </div>
          </div>
          {hasPassword && (
            <div style={{ paddingTop: '12px' }}>
              <input type="text" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter a password for viewers"
                style={{ width: '100%', padding: '9px 13px', border: '1px solid rgba(83,74,183,0.25)', borderRadius: '9px', fontSize: '14px', fontFamily: 'sans-serif', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          )}
        </div>

        <button onClick={handlePublish} disabled={loading} style={{
          background: '#6040C8', color: 'white', fontSize: '14px', fontWeight: '500',
          padding: '13px 28px', borderRadius: '9px', border: 'none', cursor: 'pointer',
          opacity: loading ? 0.7 : 1, marginRight: '10px'
        }}>
          {loading ? 'Publishing...' : 'Publish drop'}
        </button>
        <button onClick={() => window.location.href = '/dashboard'} style={{
          background: 'white', color: '#1C1830', fontSize: '14px',
          padding: '12px 24px', borderRadius: '9px', border: '1px solid rgba(83,74,183,0.25)', cursor: 'pointer'
        }}>
          Cancel
        </button>
      </div>
    </div>
  )
}