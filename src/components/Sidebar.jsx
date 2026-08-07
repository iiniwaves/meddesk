'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navTop = [
  { label: 'Dashboard', icon: 'home', href: '/dashboard' },
  { label: 'Patients', icon: 'patient', href: '/patients' },
  { label: 'Appointments', icon: 'calendar', href: '/appointments' },
  { label: 'Consultations', icon: 'consult', href: '/consultations' },
  { label: 'Pharmacy', icon: 'pharmacy', href: '/pharmacy' },
]

const navBottom = [
  { label: 'Billing', icon: 'billing', href: '/billing' },
  { label: 'HMO', icon: 'hmo', href: '/hmo' },
  { label: 'Reports', icon: 'reports', href: '/reports' },
  { label: 'Staff', icon: 'staff', href: '/staff' },
]

function NavIcon({ name }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'white', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' }

  switch (name) {
    case 'home':
      return <svg {...common}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
    case 'patient':
      return <svg {...common}><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
    case 'calendar':
      return <svg {...common}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="16" y1="2" x2="16" y2="6" /></svg>
    case 'consult':
      return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M15 8h2M15 12h2" /><path d="M5 18c0-2 1.8-3 4-3s4 1 4 3" /></svg>
    case 'pharmacy':
      return <svg {...common}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /><path d="M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /></svg>
    case 'billing':
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M14.5 9a3 3 0 0 0-5 2c0 3 5 3 5 6a3 3 0 0 1-5 2" /><line x1="12" y1="6" x2="12" y2="8" /><line x1="12" y1="16" x2="12" y2="18" /></svg>
    case 'hmo':
      return <svg {...common}><rect x="2" y="7" width="20" height="15" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><line x1="12" y1="12" x2="12" y2="16" /><line x1="10" y1="14" x2="14" y2="14" /></svg>
    case 'reports':
      return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="8" y1="17" x2="8" y2="12" /><line x1="12" y1="17" x2="12" y2="8" /><line x1="16" y1="17" x2="16" y2="14" /></svg>
    case 'staff':
      return <svg {...common}><circle cx="9" cy="7" r="3" /><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5" /><circle cx="17" cy="8" r="2.5" /><path d="M21 20c0-2.5-1.8-4-4-4" /></svg>
    case 'settings':
      return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
    default:
      return null
  }
}

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname()

  function isActive(href) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  function renderNavItems(items, onClick) {
    return items.map(item => {
      const active = isActive(item.href)
      return (
        <Link
          key={item.label}
          href={item.href}
          onClick={onClick}
          className={[
            'flex items-center gap-[14px] rounded-xl text-white transition-opacity duration-150 block',
            'py-3.5 px-4 mb-2 text-sm whitespace-nowrap min-h-[48px]',
            active ? 'bg-[#0D7377] font-semibold opacity-100' : 'opacity-70 hover:opacity-100',
          ].join(' ')}
        >
          <NavIcon name={item.icon} />
          {item.label}
        </Link>
      )
    })
  }

  // Shared sidebar content — reused for both desktop and mobile
  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="pt-6 pb-8 px-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#0D7377] flex items-center justify-center">
            <span className="text-[#4ADE80] text-lg leading-none">★</span>
          </div>
          <span className="text-white font-bold text-base tracking-tight">MedicDesk</span>
        </div>
      </div>

      {/* Top nav */}
      <nav className="px-4">{renderNavItems(navTop)}</nav>

      <div className="flex-1" />

      {/* Bottom nav */}
      <nav className="px-4">{renderNavItems(navBottom)}</nav>

      <div className="flex-1" />

      {/* Settings */}
      <div className="pb-10 px-4">
        {renderNavItems([{ label: 'Settings', icon: 'settings', href: '/settings' }], onClose)}
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar — fixed, always visible on md+ */}
      <aside className="hidden md:flex md:w-[216px] md:flex-col md:fixed md:top-0 md:left-0 md:h-full md:z-40 bg-[#0F3460]">
        {sidebarContent}
      </aside>

      {/* Mobile drawer — off-screen by default */}
      <div
        className={[
          'md:hidden', // only rendered on small screens
        ].join(' ')}
      >
        {/* Backdrop + drawer wrapper */}
        <div
          className="fixed inset-0 z-40"
          style={{ display: isOpen ? 'block' : 'none' }}
        >
          {/* Dark backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />
          {/* Slide-in panel */}
          <aside
            className="absolute top-0 left-0 h-full w-[260px] max-w-[85vw] flex flex-col bg-[#0F3460] overflow-y-auto"
            style={{
              transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
              transition: 'transform 0.2s ease-out',
            }}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="absolute top-4 right-4 p-1 text-white/70 hover:text-white border-none bg-transparent cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {sidebarContent}
          </aside>
        </div>
      </div>
    </>
  )
}
