'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

const PicdropLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '9px', cursor: 'pointer' }} onClick={() => window.location.href = '/dashboard'}>
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

export default function Settings() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwMessage, setPwMessage] = useState('')
  const [pwError, setPwError] = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleteInput, setDeleteInput] = useState('')

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUser(user)
      setLoading(false)
    }
    init()
  }, [])

  const handleChangePassword = async () => {
    if (!newPassword) { setPwError(true); setPwMessage('Please enter a new password'); return }
    if (newPassword !== confirmPassword) { setPwError(true); setPwMessage('Passwords do not match'); return }
    if (newPassword.length < 6) { setPwError(true); setPwMessage('Password must be at least 6 characters'); return }
    setSavingPw(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setSavingPw(false)
    if (error) { setPwError(true); setPwMessage(error.message) }
    else { setPwError(false); setPwMessage('Password updated!'); setNewPassword(''); setConfirmPassword('') }
    setTimeout(() => setPwMessage(''), 3000)
  }

  const handleDeleteAccount = async () => {
    if (deleteInput !== 'delete') return
    // Delete all user data
    const { data: drops } = await supabase.from('drops').select('id').eq('user_id', user.id)
    if (drops) {
      for (const drop of drops) {
        await supabase.from('photos').delete().eq('drop_id', drop.id)
      }
      await supabase.from('drops').delete().eq('user_id', user.id)
    }
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const cardStyle = { background: '#fff', border: '1px solid rgba(83,74,183,0.1)', borderRadius: '16px', padding: '24px', marginBottom: '12px' }
  const secLabel = { fontSize: '11px', fontWeight: '600', color: '#6040C8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }
  const inputStyle = { width: '100%', padding: '11px 13px', border: '1px solid rgba(83,74,183,0.18)', borderRadius: '9px', fontSize: '15px', fontFamily: 'var(--font-inter)', outline: 'none', boxSizing: 'border-box', color: '#1C1830', background: '#FAFAFA' }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F2F0F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#6B6485', fontSize: '14px' }}>Loading...</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F2F0F8', fontFamily: 'var(--font-inter)' }}>

      {/* NAV */}
      <nav style={{
        background: 'rgba(28,24,48,0.96)', backdropFilter: 'blur(12px)',
        padding: '0 28px', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <PicdropLogo />
        <div onClick={() => window.location.href = '/dashboard'} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
          ← Dashboard
        </div>
      </nav>

      <div style={{ maxWidth: '580px', margin: '0 auto', padding: '40px 24px' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: '#1C1830', letterSpacing: '-0.02em', marginBottom: '6px' }}>
            Account
          </div>
          <div style={{ fontSize: '14px', color: '#6B6485' }}>{user?.email}</div>
        </div>

        {/* PLAN */}
        <div style={{ ...cardStyle, background: '#1C1830', border: '1px solid rgba(155,143,228,0.2)' }}>
          <div style={{ ...secLabel, color: '#9B8FE4' }}>Your plan</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '22px', fontWeight: '600', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '4px' }}>
                Free
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                3 active drops · 50 photos per drop · 30 day max expiry
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/pricing'}
              style={{ background: '#6040C8', color: 'white', fontSize: '13px', fontWeight: '500', padding: '10px 20px', borderRadius: '9px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Upgrade to Pro
            </button>
          </div>

          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '10px', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: '600' }}>
              Pro — $6.99/mo includes
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {[
                'Unlimited active drops',
                '100 photos per drop',
                'Up to 90 day expiry',
                'Video support',
                'Custom domain',
                'Priority support',
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: 'rgba(155,143,228,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '8px', color: '#9B8FE4' }}>✓</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>{f}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ACCOUNT INFO */}
        <div style={cardStyle}>
          <div style={secLabel}>Account info</div>
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: '#1C1830' }}>Email</label>
            <div style={{ ...inputStyle, color: '#6B6485', cursor: 'not-allowed', display: 'flex', alignItems: 'center' }}>
              {user?.email}
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#9B9BA8', marginTop: '8px' }}>
            To change your email contact us at hello@picdrop.live
          </div>
        </div>

        {/* CHANGE PASSWORD */}
        <div style={cardStyle}>
          <div style={secLabel}>Change password</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: '#1C1830' }}>New password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: '#1C1830' }}>Confirm new password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={inputStyle}
              />
            </div>
            {pwMessage && (
              <div style={{ fontSize: '13px', color: pwError ? '#DC2626' : '#0F6E56', padding: '10px 13px', background: pwError ? '#FEF2F2' : '#E1F5EE', borderRadius: '8px' }}>
                {pwMessage}
              </div>
            )}
            <button
              onClick={handleChangePassword}
              disabled={savingPw}
              style={{ background: '#6040C8', color: 'white', fontSize: '14px', fontWeight: '500', padding: '12px', borderRadius: '9px', border: 'none', cursor: 'pointer', opacity: savingPw ? 0.7 : 1 }}
            >
              {savingPw ? 'Updating...' : 'Update password'}
            </button>
          </div>
        </div>

        {/* DANGER ZONE */}
        <div style={{ ...cardStyle, border: '1px solid rgba(220,38,38,0.15)' }}>
          <div style={{ ...secLabel, color: '#DC2626' }}>Danger zone</div>
          {!deleteConfirm ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#1C1830', fontWeight: '500', marginBottom: '3px' }}>Delete account</div>
                <div style={{ fontSize: '12px', color: '#9B9BA8' }}>Permanently delete your account and all drops</div>
              </div>
              <button
                onClick={() => setDeleteConfirm(true)}
                style={{ background: '#FEF2F2', color: '#DC2626', fontSize: '13px', fontWeight: '500', padding: '9px 18px', borderRadius: '8px', border: '1px solid rgba(220,38,38,0.2)', cursor: 'pointer' }}
              >
                Delete account
              </button>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '14px', color: '#DC2626', marginBottom: '12px', fontWeight: '500' }}>
                This will permanently delete your account and all your drops. Type <strong>delete</strong> to confirm.
              </div>
              <input
                type="text"
                placeholder="Type delete to confirm"
                value={deleteInput}
                onChange={e => setDeleteInput(e.target.value)}
                style={{ ...inputStyle, marginBottom: '10px', border: '1px solid rgba(220,38,38,0.3)' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteInput !== 'delete'}
                  style={{ background: '#DC2626', color: 'white', fontSize: '13px', fontWeight: '500', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: deleteInput === 'delete' ? 'pointer' : 'not-allowed', opacity: deleteInput === 'delete' ? 1 : 0.4 }}
                >
                  Permanently delete
                </button>
                <button
                  onClick={() => { setDeleteConfirm(false); setDeleteInput('') }}
                  style={{ background: '#F2F0F8', color: '#6B6485', fontSize: '13px', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}