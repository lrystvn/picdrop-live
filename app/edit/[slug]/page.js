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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }

      const { data: drop } = await supabase
        .from('drops')
        .select('*')
        .eq('slug', slug)
        .eq('user_id', user.id)
        .single()

      if (!drop) { window.location.href = '/dashboard'; return }

      setDrop(drop)
      setTitle(drop.title)
      setCaption(drop.caption || '')
      await loadPhotos(drop.id)
      setLoading(false)
    }
    init()
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

  const handleAddPhotos = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)

    for (const file of files) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${drop.id}/${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, file)

      if (!uploadError) {
        await supabase.from('photos').insert({
          drop_id: drop.id,
          file_path: fileName
        })
      }
    }

    await loadPhotos(drop.id)
    setUploading(false)
    setMessage('Photos added!')
    setTimeout(() => setMessage(''), 2000)
  }

  const handleDeletePhoto = async (photo) => {
    if (!confirm('Delete this photo?')) return
    await supabase.storage.from('photos').remove([photo.file_path])
    await supabase.from('photos').delete().eq('id', photo.id)
    setPhotos(prev => prev.filter(p => p.id !== photo.id))
  }

  const handleSave = async () => {
    setSaving(true)
    await supabase
      .from('drops')
      .update({ title, caption })
      .eq('id', drop.id)
    setSaving(false)
    setMessage('Saved!')
    setTimeout(() => setMessage(''), 2000)
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
        <div onClick={() => window.location.href = '/dashboard'} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
          ← Dashboard
        </div>
      </nav>

      <div style={{ maxWidth: '660px', margin: '0 auto', padding: '36px 24px' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '28px', marginBottom: '5px', color: '#1C1830' }}>
          Edit drop
        </div>
        <div style={{ fontSize: '14px', color: '#6B6485', marginBottom: '28px' }}>
          picdrop.live/drop/{slug}
        </div>

        {message && (
          <div style={{ background: '#E1F5EE', color: '#0F6E56', padding: '10px 14px', borderRadius: '9px', fontSize: '13px', marginBottom: '16px' }}>
            {message}
          </div>
        )}

        {/* DETAILS */}
        <div style={{ background: '#fff', border: '1px solid rgba(83,74,183,0.15)', borderRadius: '14px', padding: '22px', marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: '500', color: '#6040C8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Details
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: '#1C1830' }}>Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              style={{ width: '100%', padding: '9px 13px', border: '1px solid rgba(83,74,183,0.25)', borderRadius: '9px', fontSize: '14px', fontFamily: 'sans-serif', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: '#1C1830' }}>Caption</label>
            <textarea value={caption} onChange={e => setCaption(e.target.value)}
              style={{ width: '100%', padding: '9px 13px', border: '1px solid rgba(83,74,183,0.25)', borderRadius: '9px', fontSize: '14px', fontFamily: 'sans-serif', outline: 'none', resize: 'vertical', minHeight: '74px', boxSizing: 'border-box' }} />
          </div>
          <button onClick={handleSave} disabled={saving} style={{
            background: '#6040C8', color: 'white', fontSize: '13px', fontWeight: '500',
            padding: '9px 20px', borderRadius: '9px', border: 'none', cursor: 'pointer',
            opacity: saving ? 0.7 : 1
          }}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>

        {/* PHOTOS */}
        <div style={{ background: '#fff', border: '1px solid rgba(83,74,183,0.15)', borderRadius: '14px', padding: '22px', marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: '500', color: '#6040C8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Photos ({photos.length})
          </div>

          <label style={{
            display: 'block', border: '2px dashed rgba(83,74,183,0.25)',
            borderRadius: '9px', padding: '20px', textAlign: 'center', cursor: 'pointer', marginBottom: '14px'
          }}>
            <input type="file" accept="image/*" multiple onChange={handleAddPhotos} style={{ display: 'none' }} />
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>📷</div>
            <div style={{ fontSize: '13px', fontWeight: '500', color: '#1C1830' }}>
              {uploading ? 'Uploading...' : 'Click to add more photos'}
            </div>
          </label>

          {photos.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '6px' }}>
              {photos.map((p, i) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: '7px', overflow: 'hidden' }}>
                  <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div onClick={() => handleDeletePhoto(p)} style={{
                    position: 'absolute', top: '4px', right: '4px',
                    width: '22px', height: '22px', background: 'rgba(163,45,45,0.85)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', fontSize: '12px', color: 'white'
                  }}>×</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#6B6485', fontSize: '13px', padding: '20px' }}>
              No photos yet
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => window.location.href = `/drop/${slug}`} style={{
            background: '#EDE9F9', color: '#6040C8', fontSize: '13px', fontWeight: '500',
            padding: '10px 20px', borderRadius: '9px', border: 'none', cursor: 'pointer'
          }}>
            View drop
          </button>
          <button onClick={() => window.location.href = '/dashboard'} style={{
            background: 'white', color: '#1C1830', fontSize: '13px',
            padding: '10px 20px', borderRadius: '9px', border: '1px solid rgba(83,74,183,0.25)', cursor: 'pointer'
          }}>
            Back to dashboard
          </button>
        </div>
      </div>
    </div>
  )
}