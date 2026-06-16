'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

const PicdropLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '9px', cursor: 'pointer', justifyContent: 'center' }} onClick={() => window.location.href = '/'}>
    <div style={{ width: 24, height: 24, background: '#6040C8', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Check if we have a valid session from the reset link
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true)
      else setReady(false)
    })
  }, [])

  const handleReset = async () => {
    if (!password) { setIsError(true); setMessage('Please enter a new password'); return }
    if (password !== confirmPassword) { setIsError(true); setMessage('Passwords do not match'); return }
    if (password.length < 6) { setIsError(true); setMessage('Password must be at least 6 characters'); return }

    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) { setIsError(true); setMessage(error.message) }
    else {
      setIsError(false)
      setMessage('Password updated! Redirecting...')
      setTimeout(() => window.location.href = '/dashboard', 1500)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#1C1830',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: 'var(--font-inter)'
    }}>
      <div style={{ marginBottom: '32px' }}><PicdropLogo /></div>

      <div style={{ background: '#ffffff', borderRadius: '18px', padding: '36px 32px', maxWidth: '380px', width: '100%', boxShadow: '0 0 0 1px rgba(83,74,183,0.1)' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: '#1C1830', marginBottom: '6px', letterSpacing: '-0.02em' }}>
            Set a new password
          </div>
          <div style={{ fontSize: '14px', color: '#6B6485', lineHeight: 1.5 }}>
            Choose a strong password for your account.
          </div>
        </div>

        {!ready ? (
          <div style={{ fontSize: '14px', color: '#6B6485', textAlign: 'center', padding: '20px 0' }}>
            This reset link has expired or is invalid.{' '}
            <span onClick={() => window.location.href = '/login'} style={{ color: '#6040C8', cursor: 'pointer' }}>
              Request a new one
            </span>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1C1830', marginBottom: '6px' }}>New password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '11px 44px 11px 13px', border: '1px solid rgba(83,74,183,0.2)', borderRadius: '9px', fontSize: '15px', fontFamily: 'var(--font-inter)', outline: 'none', boxSizing: 'border-box', color: '#1C1830', background: '#FAFAFA' }}
                  />
                  <div onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '16px', opacity: 0.4, userSelect: 'none' }}>
                    {showPw ? '🙈' : '👁️'}
                  </div>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1C1830', marginBottom: '6px' }}>Confirm new password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleReset()}
                  style={{ width: '100%', padding: '11px 13px', border: '1px solid rgba(83,74,183,0.2)', borderRadius: '9px', fontSize: '15px', fontFamily: 'var(--font-inter)', outline: 'none', boxSizing: 'border-box', color: '#1C1830', background: '#FAFAFA' }}
                />
              </div>
            </div>

            {message && (
              <div style={{ fontSize: '13px', color: isError ? '#A32D2D' : '#0F6E56', marginBottom: '14px', padding: '10px 13px', background: isError ? '#FEF2F2' : '#E1F5EE', borderRadius: '8px', lineHeight: 1.5 }}>
                {message}
              </div>
            )}

            <button
              onClick={handleReset}
              disabled={loading}
              style={{ width: '100%', background: '#6040C8', color: 'white', fontSize: '15px', fontWeight: '500', padding: '13px', borderRadius: '9px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}