'use client'
import { useState } from 'react'
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

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleAuth = async () => {
    setLoading(true)
    setMessage('')

    if (isSignUp && password !== confirmPassword) {
      setMessage('Passwords do not match')
      setLoading(false)
      return
    }

    if (isSignUp && !agreedToTerms) {
      setMessage('Please agree to the Terms of Service and Privacy Policy')
      setLoading(false)
      return
    }

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(error.message)
      else setMessage('Check your email to confirm your account!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
      else window.location.href = '/dashboard'
    }
    setLoading(false)
  }

  const isError = message && !message.includes('Check your email')

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1C1830',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ marginBottom: '32px' }}>
        <PicdropLogo />
      </div>

      <div style={{
        background: '#ffffff',
        borderRadius: '18px',
        padding: '36px 32px',
        maxWidth: '380px',
        width: '100%',
        boxShadow: '0 0 0 1px rgba(83,74,183,0.1)'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: '#1C1830', marginBottom: '6px', letterSpacing: '-0.02em' }}>
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </div>
          <div style={{ fontSize: '14px', color: '#6B6485', lineHeight: 1.5 }}>
            {isSignUp ? 'Start sharing photos privately in minutes.' : 'Sign in to manage your drops.'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1C1830', marginBottom: '6px' }}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAuth()}
              style={{ width: '100%', padding: '11px 13px', border: '1px solid rgba(83,74,183,0.2)', borderRadius: '9px', fontSize: '15px', fontFamily: 'sans-serif', outline: 'none', boxSizing: 'border-box', color: '#1C1830', background: '#FAFAFA' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1C1830', marginBottom: '6px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAuth()}
                style={{ width: '100%', padding: '11px 44px 11px 13px', border: '1px solid rgba(83,74,183,0.2)', borderRadius: '9px', fontSize: '15px', fontFamily: 'sans-serif', outline: 'none', boxSizing: 'border-box', color: '#1C1830', background: '#FAFAFA' }}
              />
              <div onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '16px', opacity: 0.4, userSelect: 'none' }}>
                {showPw ? '🙈' : '👁️'}
              </div>
            </div>
          </div>

          {isSignUp && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1C1830', marginBottom: '6px' }}>Confirm password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAuth()}
                style={{ width: '100%', padding: '11px 13px', border: '1px solid rgba(83,74,183,0.2)', borderRadius: '9px', fontSize: '15px', fontFamily: 'sans-serif', outline: 'none', boxSizing: 'border-box', color: '#1C1830', background: '#FAFAFA' }}
              />
            </div>
          )}

          {isSignUp && (
            <div
              onClick={() => setAgreedToTerms(!agreedToTerms)}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', paddingTop: '4px' }}
            >
              <div style={{
                width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0, marginTop: '1px',
                background: agreedToTerms ? '#6040C8' : 'white',
                border: `1.5px solid ${agreedToTerms ? '#6040C8' : 'rgba(83,74,183,0.3)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .15s'
              }}>
                {agreedToTerms && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div style={{ fontSize: '13px', color: '#6B6485', lineHeight: 1.5 }}>
                I agree to the{' '}
                <span
                  onClick={e => { e.stopPropagation(); window.open('/terms', '_blank') }}
                  style={{ color: '#6040C8', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Terms of Service
                </span>
                {' '}and{' '}
                <span
                  onClick={e => { e.stopPropagation(); window.open('/privacy', '_blank') }}
                  style={{ color: '#6040C8', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Privacy Policy
                </span>
              </div>
            </div>
          )}
        </div>

        {message && (
          <div style={{
            fontSize: '13px',
            color: isError ? '#A32D2D' : '#0F6E56',
            marginBottom: '14px',
            padding: '10px 13px',
            background: isError ? '#FEF2F2' : '#E1F5EE',
            borderRadius: '8px',
            lineHeight: 1.5
          }}>
            {message}
          </div>
        )}

        <button
          onClick={handleAuth}
          disabled={loading}
          style={{
            width: '100%',
            background: '#6040C8',
            color: 'white',
            fontSize: '15px',
            fontWeight: '500',
            padding: '13px',
            borderRadius: '9px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '16px',
            opacity: loading ? 0.7 : 1,
            letterSpacing: '-0.01em'
          }}
        >
          {loading ? 'Loading...' : isSignUp ? 'Create account' : 'Sign in'}
        </button>

        <div style={{ textAlign: 'center' }}>
          <span
            onClick={() => { setIsSignUp(!isSignUp); setMessage(''); setConfirmPassword(''); setAgreedToTerms(false) }}
            style={{ fontSize: '13px', color: '#6040C8', cursor: 'pointer' }}
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </span>
        </div>
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
        Your photos are private and automatically deleted on expiry.
      </div>
    </div>
  )
}