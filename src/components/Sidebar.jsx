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

function NavIcon({ name, active }) {
  const stroke = 'white'
  const sw = '1.8'
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' }

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

export default function Sidebar() {
  const pathname = usePathname()

  function isActive(href) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  function renderNav(items) {
    return items.map(item => {
      const active = isActive(item.href)
      return (
        <Link key={item.label} href={item.href} style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '12px 16px', marginBottom: 8,
          textDecoration: 'none', color: 'white',
          backgroundColor: active ? '#0D7377' : 'transparent',
          borderRadius: 10, fontSize: 14,
          fontWeight: active ? 600 : 400,
          opacity: active ? 1 : 0.7,
        }}>
          <NavIcon name={item.icon} active={active} />
          {item.label}
        </Link>
      )
    })
  }

  return (
    <div style={{ width: 216, backgroundColor: '#0F3460', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 20 }}>
      <div style={{ padding: '24px 20px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#0D7377', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#4ADE80', fontSize: 18 }}>★</span>
          </div>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 17 }}>MedicDesk</span>
        </div>
      </div>

      <nav style={{ padding: '0 16px' }}>{renderNav(navTop)}</nav>
      <div style={{ flex: 1 }} />
      <nav style={{ padding: '0 16px' }}>{renderNav(navBottom)}</nav>
      <div style={{ flex: 1 }} />

      <div style={{ padding: '0 16px 40px' }}>
        <Link href="/settings" style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '12px 16px', textDecoration: 'none',
          color: 'white', borderRadius: 10, fontSize: 14, opacity: 0.7,
        }}>
          <NavIcon name="settings" active={false} />
          Settings
        </Link>
      </div>
    </div>
  )
}
