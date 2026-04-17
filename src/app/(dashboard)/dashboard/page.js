'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#475569', fontSize: 14 }}>Loading...</p>
      </div>
    )
  }

  const appointments = [
    { patient: 'Amaka Shodiya', time: '09:15 AM', doctor: 'Dr Danladi', status: 'done' },
    { patient: 'Paul Eze', time: '09:15 AM', doctor: 'Dr Danladi', status: 'pending' },
    { patient: 'Tomiwa Adewole', time: '09:15 AM', doctor: 'Dr Danladi', status: 'pending' },
    { patient: 'Tukur Abubakar', time: '09:15 AM', doctor: 'Dr Danladi', status: 'pending' },
  ]

  const recentPatients = [
    { name: 'Gladys Shodiya', info: '25, F' },
    { name: 'Opeyemi Ajala', info: '24, F' },
    { name: 'Amaka Nwaogu', info: '18, F' },
    { name: 'Tukur Abubakar', info: '32, M' },
  ]

  const lowStock = [
    { drug: 'Ibuprofen', qty: 4 },
    { drug: 'Paracetamol', qty: 4 },
    { drug: 'Iverctimin', qty: 4 },
  ]

  const stats = [
    { value: '24', label: "Today's Patients", trend: 'up', trendText: '12.8% more this month' },
    { value: '8', label: 'Appointments', trend: 'down', trendText: '17.8% less this month' },
    { value: '₦97,000', label: 'Revenue Today', trend: 'up', trendText: '12.8% more this month' },
    { value: '6', label: 'Inventory', trend: 'down', trendText: '17.8% less this month' },
  ]

  const statusStyle = {
    done: { backgroundColor: '#22C55E', color: 'white' },
    pending: { backgroundColor: '#F59E0B', color: 'white' },
    confirmed: { backgroundColor: '#0D7377', color: 'white' },
  }

  function getInitials(name) {
    if (!name) return 'MD'
    return name.split(' ').map(n => n[0]).join('')
  }

  const navTop = [
    { label: 'Dashboard', icon: HomeIcon, href: '/dashboard', active: true },
    { label: 'Patients', icon: PatientIcon, href: '/patients' },
    { label: 'Appointments', icon: CalendarIcon, href: '/appointments' },
    { label: 'Consultations', icon: ConsultIcon, href: '/consultations' },
    { label: 'Pharmacy', icon: PharmacyIcon, href: '/pharmacy' },
  ]

  const navBottom = [
    { label: 'Billing', icon: BillingIcon, href: '/billing' },
    { label: 'HMO', icon: HMOIcon, href: '/hmo' },
    { label: 'Reports', icon: ReportsIcon, href: '/reports' },
    { label: 'Staff', icon: StaffIcon, href: '/staff' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'Inter, -apple-system, sans-serif' }}>

      {/* Sidebar */}
<div style={{ width: 216, backgroundColor: '#0F3460', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 20 }}>

{/* Logo */}
<div style={{ padding: '24px 20px 32px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#0D7377', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#4ADE80', fontSize: 18 }}>★</span>
    </div>
    <span style={{ color: 'white', fontWeight: 700, fontSize: 17 }}>MedicDesk</span>
  </div>
</div>

{/* Top nav */}
<nav style={{ padding: '0 16px' }}>
  {[
    { label: 'Dashboard', icon: HomeIcon, href: '/dashboard', active: true },
    { label: 'Patients', icon: PatientIcon, href: '/patients' },
    { label: 'Appointments', icon: CalendarIcon, href: '/appointments' },
    { label: 'Consultations', icon: ConsultIcon, href: '/consultations' },
    { label: 'Pharmacy', icon: PharmacyIcon, href: '/pharmacy' },
  ].map(item => (
    <a key={item.label} href={item.href} style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '12px 16px',
      marginBottom: 8,
      textDecoration: 'none',
      color: 'white',
      backgroundColor: item.active ? '#0D7377' : 'transparent',
      borderRadius: 10,
      fontSize: 14,
      fontWeight: item.active ? 600 : 400,
      opacity: item.active ? 1 : 0.7,
    }}>
      <item.icon active={item.active} />
      {item.label}
    </a>
  ))}
</nav>

{/* Spacer */}
<div style={{ flex: 1 }} />

{/* Middle nav */}
<nav style={{ padding: '0 16px' }}>
  {[
    { label: 'Billing', icon: BillingIcon, href: '/billing' },
    { label: 'HMO', icon: HMOIcon, href: '/hmo' },
    { label: 'Reports', icon: ReportsIcon, href: '/reports' },
    { label: 'Staff', icon: StaffIcon, href: '/staff' },
  ].map(item => (
    <a key={item.label} href={item.href} style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '12px 16px',
      marginBottom: 8,
      textDecoration: 'none',
      color: 'white',
      borderRadius: 10,
      fontSize: 14,
      fontWeight: 400,
      opacity: 0.7,
    }}>
      <item.icon active={false} />
      {item.label}
    </a>
  ))}
</nav>

{/* Spacer */}
<div style={{ flex: 1 }} />

{/* Settings */}
<div style={{ padding: '0 16px 40px' }}>
  <a href="/settings" style={{
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '12px 16px',
    textDecoration: 'none',
    color: 'white',
    borderRadius: 10,
    fontSize: 14,
    opacity: 0.7,
  }}>
    <SettingsIcon active={false} />
    Settings
  </a>
</div>

</div>

      {/* Main */}
      <div style={{ marginLeft: 216, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Top bar */}
        <div style={{ height: 64, backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', position: 'sticky', top: 0, zIndex: 10 }}>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1E293B' }}>
            Good Morning {session?.user?.name},
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Bell */}
            <div style={{ position: 'relative', cursor: 'pointer', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '1px solid #E2E8F0' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            {/* Avatar + chevron */}
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', position: 'relative' }}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
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
                  <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    style={{ width: '100%', padding: '10px 16px', backgroundColor: 'transparent', border: 'none', textAlign: 'left', fontSize: 13, color: '#EF4444', cursor: 'pointer' }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 28px', flex: 1 }}>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {stats.map(stat => (
              <div key={stat.label} style={{ backgroundColor: 'white', borderRadius: 12, padding: '20px 20px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <p style={{ margin: 0, fontSize: 13, color: '#94A3B8', fontWeight: 400 }}>{stat.label}</p>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#CBD5E1', fontSize: 18, lineHeight: 1 }}>⋮</button>
                </div>
                <p style={{ margin: '0 0 12px', fontSize: 30, fontWeight: 700, color: '#1E293B', letterSpacing: '-0.5px' }}>{stat.value}</p>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '4px 10px', borderRadius: 999,
                  backgroundColor: stat.trend === 'up' ? '#DCFCE7' : '#FEE2E2',
                  color: stat.trend === 'up' ? '#166534' : '#991B1B',
                  fontSize: 11, fontWeight: 500
                }}>
                  {stat.trend === 'up'
                    ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                    : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></svg>
                  }
                  {stat.trendText}
                </div>
              </div>
            ))}
          </div>

          {/* Middle row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>

            {/* Appointments */}
            <div style={{ backgroundColor: 'white', borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}>
              <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: '#1E293B' }}>Today's Appointments</h2>
              <div>
                {appointments.map((apt, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderTop: i === 0 ? 'none' : '1px solid #F8FAFC' }}>
                    <span style={{ flex: 1, fontSize: 14, color: '#1E293B', fontWeight: 400 }}>{apt.patient}</span>
                    <span style={{ width: 80, fontSize: 13, color: '#64748B' }}>{apt.time}</span>
                    <span style={{ width: 100, fontSize: 13, color: '#64748B' }}>{apt.doctor}</span>
                    <span style={{ padding: '4px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, ...statusStyle[apt.status], minWidth: 70, textAlign: 'center' }}>
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, textAlign: 'right' }}>
  <a href="/appointments" style={{ fontSize: 13, color: '#0D7377', textDecoration: 'underline' }}>View All Appointments</a>
</div>
            </div>

            {/* Recent Patients */}
            <div style={{ backgroundColor: 'white', borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}>
              <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: '#1E293B' }}>Recent Patients</h2>
              <div>
                {recentPatients.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderTop: i === 0 ? 'none' : '1px solid #F8FAFC' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#E6F4F4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#0D7377' }}>{getInitials(p.name)}</span>
                    </div>
                    <span style={{ flex: 1, fontSize: 14, color: '#1E293B' }}>{p.name}</span>
                    <span style={{ fontSize: 13, color: '#94A3B8' }}>{p.info}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, textAlign: 'right' }}>
  <a href="/patients" style={{ fontSize: 13, color: '#0D7377', textDecoration: 'underline' }}>View All Patients</a>
</div>
            </div>
          </div>

        </div>

        {/* Low Stock Bar */}
        <div style={{ backgroundColor: 'white', borderTop: '1px solid #E2E8F0', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 20, position: 'sticky', bottom: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#EF4444', whiteSpace: 'nowrap' }}>Low Stock Alert!</span>
          <div style={{ display: 'flex', gap: 12, flex: 1 }}>
            {lowStock.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: '#1E293B' }}>{item.drug}</span>
                <span style={{ padding: '3px 12px', borderRadius: 999, backgroundColor: '#F59E0B', color: 'white', fontSize: 12, fontWeight: 600 }}>{item.qty} Left</span>
                <button style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: '#0D7377', border: 'none', color: 'white', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>+</button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

// Icons
function HomeIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
}
function PatientIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/><path d="M9 8h.01M15 8h.01"/><path d="M9 11c.5.5 1 .8 3 .8s2.5-.3 3-.8"/></svg>
}
function CalendarIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/><rect x="7" y="14" width="3" height="3" rx="0.5"/><rect x="11" y="14" width="3" height="3" rx="0.5"/></svg>
}
function ConsultIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M15 8h2M15 12h2"/><path d="M5 18c0-2 1.8-3 4-3s4 1 4 3"/></svg>
}
function PharmacyIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/><path d="M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/></svg>
}
function BillingIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M14.5 9a3 3 0 0 0-5 2c0 3 5 3 5 6a3 3 0 0 1-5 2"/><line x1="12" y1="6" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="18"/></svg>
}
function HMOIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
}
function ReportsIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="8" y1="17" x2="8" y2="12"/><line x1="12" y1="17" x2="12" y2="8"/><line x1="16" y1="17" x2="16" y2="14"/></svg>
}
function StaffIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="3"/><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5"/><circle cx="17" cy="8" r="2.5"/><path d="M21 20c0-2.5-1.8-4-4-4"/></svg>
}
function SettingsIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
}