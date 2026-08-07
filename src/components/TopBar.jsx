'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useSidebar } from '@/app/(dashboard)/providers/SidebarProvider'

function getInitials(name) {
  if (!name) return 'MD'
  return name.split(' ').map(n => n[0]).join('')
}

export default function TopBar({ title, greeting, onBack }) {
  const { data: session } = useSession()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const sidebar = useSidebar()

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
    <header className="h-14 md:h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-3 md:px-7 shrink-0">
      {/* Left side — back button or hamburger + title */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Hamburger button — mobile only */}
        <button
          type="button"
          onClick={sidebar.toggle}
          aria-label="Open menu"
          className="md:hidden p-1 -ml-1 text-[#475569] hover:text-[#1E293B] border-none bg-transparent cursor-pointer"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Back arrow (when navigating back from sub-pages) */}
        {onBack && (
          <span
            onClick={onBack}
            className="cursor-pointer hidden md:flex items-center shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </span>
        )}

        {/* Title */}
        <p className="text-base md:text-xl font-bold text-[#1E293B] truncate m-0 leading-tight">{display}</p>
      </div>

      {/* Right side — notifications + user */}
      <div className="flex items-center gap-3 md:gap-4 shrink-0">
        {/* Notification bell */}
        <div className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-full border border-[#E2E8F0] shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>

        {/* User avatar + dropdown */}
        <div data-usermenu="true" className="flex items-center gap-2 cursor-pointer relative shrink-0" onClick={() => setShowUserMenu(!showUserMenu)}>
          <div className="w-8 h-8 rounded-full bg-[#0D7377] flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">{getInitials(session?.user?.name)}</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hidden md:block shrink-0">
            <polyline points="6 9 12 15 18 9" />
          </svg>
          {showUserMenu && (
            <div style={{ position: 'absolute', top: 44, right: 0, backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', minWidth: 160, zIndex: 100 }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9' }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{session?.user?.name}</p>
                <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>{session?.user?.role}</p>
              </div>
              <button onClick={() => signOut({ callbackUrl: '/login' })} className="w-full py-2.5 px-4 bg-transparent border-none text-left text-sm text-[#EF4444] cursor-pointer hover:bg-[#FEF2F2]">
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
