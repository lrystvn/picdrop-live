'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function Dashboard() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) window.location.href = '/login'
      else setUser(user)
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (!user) return null

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F2F0F8',
      fontFamily: 'sans-serif'
    }}>
      <nav style={{
        background: '#1C1830',
        padding: '0 28px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{
          fontFamily: 'Georgia, serif',
          fontSize: '21px',
          color: '#ffffff'
        }}>
          Pic<span style={{ color: '#9B8FE4', fontStyle: 'italic' }}>drop</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
            {user.email}
          </div>
          <button
            onClick={handleSignOut}
            style={{
              background: 'transparent',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '13px',
              padding: '6px 12px',
              borderRadius: '9px',
              border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer'
            }}
          >
            Sign out
          </button>
        </div>
      </nav>

      <div style={{
        maxWidth: '880px',
        margin: '0 auto',
        padding: '36px 24px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: '28px',
              color: '#1C1830'
            }}>
              Your drops
            </div>
            <div style={{ fontSize: '13px', color: '#6B6485', marginTop: '3px' }}>
              All your photo drops in one place
            </div>
          </div>
          <button style={{
            background: '#6040C8',
            color: 'white',
            fontSize: '13px',
            fontWeight: '500',
            padding: '10px 20px',
            borderRadius: '9px',
            border: 'none',
            cursor: 'pointer'
          }}>
            + New drop
          </button>
        </div>

        <div style={{
          background: '#ffffff',
          border: '1px solid rgba(83,74,183,0.15)',
          borderRadius: '14px',
          padding: '48px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📷</div>
          <div style={{
            fontSize: '16px',
            fontWeight: '500',
            color: '#1C1830',
            marginBottom: '6px'
          }}>
            No drops yet
          </div>
          <div style={{ fontSize: '14px', color: '#6B6485', marginBottom: '20px' }}>
            Create your first drop and share your photos
          </div>
          <button style={{
            background: '#6040C8',
            color: 'white',
            fontSize: '13px',
            fontWeight: '500',
            padding: '10px 20px',
            borderRadius: '9px',
            border: 'none',
            cursor: 'pointer'
          }}>
            + Create your first drop
          </button>
        </div>
      </div>
    </div>
  )
}