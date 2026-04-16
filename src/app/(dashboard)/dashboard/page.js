'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

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
    { patient: 'Amaka Obi', time: '09:00', doctor: 'Dr. Chidi', status: 'pending' },
    { patient: 'John Eze', time: '10:30', doctor: 'Dr. Bello', status: 'confirmed' },
    { patient: 'Grace Musa', time: '11:00', doctor: 'Dr. Chidi', status: 'done' },
    { patient: 'Peter Ade', time: '14:00', doctor: 'Dr. Bello', status: 'pending' },
  ]

  const recentPatients = [
    { name: 'Amaka Obi', info: '32F' },
    { name: 'John Eze', info: '45M' },
    { name: 'Grace Musa', info: '28F' },
    { name: 'Peter Ade', info: '51M' },
  ]

  const lowStock = [
    { drug: 'Amoxicillin 500mg', qty: 12 },
    { drug: 'Paracetamol', qty: 8 },
    { drug: 'Metformin', qty: 5 },
  ]

  const statusColors = {
    pending: { bg: '#FEF3C7', color: '#92400E' },
    confirmed: { bg: '#E6F4F4', color: '#0D7377' },
    done: { bg: '#DCFCE7', color: '#166534' },
  }

  function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('')
  }

  const navItems = [
    { label: 'Dashboard', icon: '⊞', href: '/dashboard', active: true },
    { label: 'Patients', icon: '👤', href: '/patients' },
    { label: 'Appointments', icon: '📅', href: '/appointments' },
    { label: 'Consultations', icon: '🩺', href: '/consultations' },
    { label: 'Pharmacy', icon: '💊', href: '/pharmacy' },
    { label: 'Billing', icon: '₦', href: '/billing' },
    { label: 'HMO', icon: '🏥', href: '/hmo' },
    { label: 'Reports', icon: '📊', href: '/reports' },
    { label: 'Staff', icon: '👥', href: '/staff' },
    { label: 'Settings', icon: '⚙️', href: '/settings' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F1F5F9', fontFamily: 'Inter, sans-serif' }}>

      {/* Sidebar */}
      <div style={{ width: 240, backgroundColor: '#0F3460', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh' }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#0D7377', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#14A085', fontSize: 16 }}>★</span>
            </div>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 17 }}>MedicDesk</span>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '16px 0' }}>
        {navItems.map(item => (
  <Link
    key={item.label}
    href={item.href}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 20px',
      textDecoration: 'none',
      color: item.active ? 'white' : 'rgba(255,255,255,0.6)',
      backgroundColor: item.active ? 'rgba(13,115,119,0.25)' : 'transparent',
      borderLeft: item.active ? '3px solid #0D7377' : '3px solid transparent',
      fontSize: 13,
      fontWeight: item.active ? 600 : 400,
    }}
  >
    <span style={{ fontSize: 15 }}>{item.icon}</span>
    {item.label}
  </Link>
))}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: '#0D7377', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>
                {session?.user?.name ? getInitials(session.user.name) : 'MD'}
              </span>
            </div>
            <div>
              <p style={{ margin: 0, color: 'white', fontSize: 13, fontWeight: 600 }}>{session?.user?.name}</p>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{session?.user?.role}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{ width: '100%', padding: '8px', backgroundColor: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 6, color: 'rgba(255,255,255,0.6)', fontSize: 12, cursor: 'pointer' }}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ marginLeft: 240, flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Top bar */}
        <div style={{ height: 64, backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 10 }}>
          <p style={{ margin: 0, fontSize: 15, color: '#1E293B', fontWeight: 500 }}>
            Good morning, <strong>{session?.user?.name}</strong>
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <span style={{ fontSize: 20 }}>🔔</span>
              <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, backgroundColor: '#EF4444', borderRadius: '50%' }} />
            </div>
            <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: '#0D7377', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>
                {session?.user?.name ? getInitials(session.user.name) : 'MD'}
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: 24 }}>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { value: '24', label: "Today's Patients", border: '#0D7377' },
              { value: '8', label: 'Appointments', border: '#F59E0B' },
              { value: '₦45,200', label: 'Revenue Today', border: '#22C55E' },
              { value: '3', label: 'Low Stock', border: '#EF4444' },
            ].map(stat => (
              <div key={stat.label} style={{ backgroundColor: 'white', borderRadius: 10, padding: '20px 24px', borderTop: `4px solid ${stat.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <p style={{ margin: '0 0 6px', fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>{stat.label}</p>
                <p style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#1E293B' }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Middle row */}
          <div style={{ display: 'grid', gridTemplateColumns: '55% 43%', gap: 16, marginBottom: 24 }}>

            {/* Appointments */}
            <div style={{ backgroundColor: 'white', borderRadius: 10, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#1E293B' }}>Today's Appointments</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC' }}>
                    {['Patient', 'Time', 'Doctor', 'Status'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 500, color: '#1E293B' }}>{apt.patient}</td>
                      <td style={{ padding: '10px 12px', fontSize: 13, color: '#475569' }}>{apt.time}</td>
                      <td style={{ padding: '10px 12px', fontSize: 13, color: '#475569' }}>{apt.doctor}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, backgroundColor: statusColors[apt.status].bg, color: statusColors[apt.status].color }}>
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recent Patients */}
            <div style={{ backgroundColor: 'white', borderRadius: 10, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#1E293B' }}>Recent Patients</h2>
              {recentPatients.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: i === 0 ? 'none' : '1px solid #F1F5F9', cursor: 'pointer' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#E6F4F4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#0D7377' }}>{getInitials(p.name)}</span>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: '#1E293B' }}>{p.name}</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>{p.info}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock */}
          <div style={{ backgroundColor: 'white', borderRadius: 10, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#1E293B' }}>Low Stock Alerts</h2>
            <div style={{ display: 'flex', gap: 16 }}>
              {lowStock.map((item, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#FEF3C7', borderRadius: 8, border: '1px solid #FDE68A' }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>{item.drug}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#92400E', backgroundColor: '#F59E0B', padding: '2px 10px', borderRadius: 999 }}>{item.qty} left</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}