'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'

function getInitials(name) {
  if (!name) return 'MD'
  return name.split(' ').map(n => n[0]).join('')
}

export default function TopBar({ title, greeting, onBack }) {
  const { data: session } = useSession()
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest('[data-usermenu]')) setShowUserMenu(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const display = greeting
    ? `Good Morning ${session?.user?.name},`
    : title

  return (
    <div style={{ height: 64, backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', position: 'sticky', top: 0, zIndex: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {onBack && (
          <span onClick={onBack} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </span>
        )}
        <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1E293B' }}>{display}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ cursor: 'pointer', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '1px solid #E2E8F0' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        <div data-usermenu="true" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', position: 'relative' }} onClick={() => setShowUserMenu(!showUserMenu)}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: '#0D7377', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>{getInitials(session?.user?.name)}</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
          {showUserMenu && (
            <div style={{ position: 'absolute', top: 44, right: 0, backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', minWidth: 160, zIndex: 100 }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9' }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{session?.user?.name}</p>
                <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>{session?.user?.role}</p>
              </div>
              <button onClick={() => signOut({ callbackUrl: '/login' })} style={{ width: '100%', padding: '10px 16px', backgroundColor: 'transparent', border: 'none', textAlign: 'left', fontSize: 13, color: '#EF4444', cursor: 'pointer' }}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
