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
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col">
      {/* Top bar */}
      <div className="bg-[#0D7377] py-3.5 md:py-3.5 px-4 md:px-8 flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-full bg-[#0F3460] flex items-center justify-center">
          <span className="text-[#14A085] text-lg leading-none">★</span>
        </div>
        <span className="text-white font-semibold text-base tracking-tight">MedicDesk</span>
      </div>

      {/* Centred card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className={[
          'bg-white rounded-xl p-8 md:p-9 shadow-sm w-full max-w-[400px]',
        ].join(' ')}>
          {/* Logo inside card */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-[#0F3460] flex items-center justify-center">
                <span className="text-[#14A085] text-lg leading-none">★</span>
              </div>
              <span className="font-semibold text-xl text-[#1E293B]">MedicDesk</span>
            </div>
          </div>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className={[
                  'w-full h-11 px-3 border rounded-lg text-sm text-[#1E293B] outline-none box-border',
                  error ? 'border-[#EF4444]' : 'border-[#CBD5E1]',
                ].join(' ')}
              />
            </div>

            {/* Password */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className={[
                  'w-full h-11 px-3 border rounded-lg text-sm text-[#1E293B] outline-none box-border',
                  error ? 'border-[#EF4444]' : 'border-[#CBD5E1]',
                ].join(' ')}
              />
            </div>

            {/* Forgot password */}
            <div className="text-right mb-4">
              <a href="#" className="text-sm text-[#0D7377] no-underline">Forgot Password?</a>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-sm text-[#EF4444] mb-3 text-center">{error}</p>
            )}

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className={[
                'w-full h-12 bg-[#0D7377] text-white border-none rounded-lg text-base font-semibold cursor-pointer mb-5',
                loading ? '!bg-[#5AADAF] !cursor-not-allowed' : '',
              ].join(' ')}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {/* Footer */}
            <p className="text-center text-sm text-[#475569] m-0">
              New clinic?{' '}
              <a href="#" className="text-[#0D7377] font-medium underline">
                Start free trial
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
