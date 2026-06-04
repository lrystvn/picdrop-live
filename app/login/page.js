'use client'
import { useState } from 'react'
import { supabase } from '../supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleAuth = async () => {
    setLoading(true)
    setMessage('')

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

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1C1830',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '14px',
        padding: '40px 36px',
        maxWidth: '380px',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{
          fontFamily: 'Georgia, serif',
          fontSize: '22px',
          marginBottom: '6px',
          color: '#1C1830'
        }}>
          Pic<span style={{ color: '#6040C8', fontStyle: 'italic' }}>drop</span>
        </div>
        <div style={{
          fontSize: '14px',
          color: '#6B6485',
          marginBottom: '28px'
        }}>
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 13px',
            border: '1px solid rgba(83,74,183,0.25)',
            borderRadius: '9px',
            fontSize: '14px',
            marginBottom: '10px',
            fontFamily: 'sans-serif',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 13px',
            border: '1px solid rgba(83,74,183,0.25)',
            borderRadius: '9px',
            fontSize: '14px',
            marginBottom: '16px',
            fontFamily: 'sans-serif',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />

        {message && (
          <div style={{
            fontSize: '13px',
            color: message.includes('error') || message.includes('Error') ? '#A32D2D' : '#0F6E56',
            marginBottom: '14px',
            padding: '8px',
            background: message.includes('error') || message.includes('Error') ? '#FDEAEA' : '#E1F5EE',
            borderRadius: '8px'
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
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px',
            borderRadius: '9px',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '14px',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Loading...' : isSignUp ? 'Create account' : 'Sign in'}
        </button>

        <div
          onClick={() => setIsSignUp(!isSignUp)}
          style={{
            fontSize: '13px',
            color: '#6040C8',
            cursor: 'pointer'
          }}
        >
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </div>
      </div>
    </div>
  )
}