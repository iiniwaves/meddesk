'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    })

    setLoading(false)

    if (result?.error) {
      setError('Incorrect email or password')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F1F5F9', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ backgroundColor: '#0D7377', padding: '14px 32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#0F3460', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#14A085', fontSize: 16 }}>★</span>
        </div>
        <span style={{ color: 'white', fontWeight: 600, fontSize: 18, letterSpacing: '-0.3px' }}>MedicDesk</span>
      </div>

      {/* Centred card — padding gives breathing room on mobile */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: '40px 36px',
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
        }}>
          {/* Logo inside card */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#0F3460', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#14A085', fontSize: 16 }}>★</span>
              </div>
              <span style={{ fontWeight: 600, fontSize: 22, color: '#1E293B' }}>MedicDesk</span>
            </div>
          </div>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#1E293B', marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  height: 44,
                  padding: '0 12px',
                  border: `1px solid ${error ? '#EF4444' : '#CBD5E1'}`,
                  borderRadius: 8,
                  fontSize: 14,
                  color: '#1E293B',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#1E293B', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  height: 44,
                  padding: '0 12px',
                  border: `1px solid ${error ? '#EF4444' : '#CBD5E1'}`,
                  borderRadius: 8,
                  fontSize: 14,
                  color: '#1E293B',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Forgot password */}
            <div style={{ textAlign: 'right', marginBottom: 16 }}>
              <a href="#" style={{ fontSize: 13, color: '#0D7377', textDecoration: 'none' }}>Forgot Password?</a>
            </div>

            {/* Error message */}
            {error && (
              <p style={{ color: '#EF4444', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{error}</p>
            )}

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: 48,
                backgroundColor: loading ? '#5aadaf' : '#0D7377',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: 20
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {/* Footer */}
            <p style={{ textAlign: 'center', fontSize: 13, color: '#475569', margin: 0 }}>
              New clinic?{' '}
              <a href="#" style={{ color: '#0D7377', fontWeight: 500, textDecoration: 'underline' }}>
                Start free trial
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}