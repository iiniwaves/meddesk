'use client'

import { useEffect, useState } from 'react'
import TopBar from '@/components/TopBar'

export default function DashboardPage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(setData)
  }, [])

  const stats = data
    ? [
        { value: String(data.stats.todayPatients), label: "Today's Patients", trend: 'up', trendText: '12.8% more this month' },
        { value: String(data.stats.appointments), label: 'Appointments', trend: 'down', trendText: '17.8% less this month' },
        { value: '₦97,000', label: 'Revenue Today', trend: 'up', trendText: '12.8% more this month' },
        { value: String(data.lowStock.length), label: 'Inventory', trend: 'down', trendText: '17.8% less this month' },
      ]
    : []

  const statusStyle = {
    done: { backgroundColor: '#22C55E', color: 'white' },
    pending: { backgroundColor: '#F59E0B', color: 'white' },
    confirmed: { backgroundColor: '#0D7377', color: 'white' },
  }

  function getInitials(name) {
    if (!name) return 'MD'
    return name.split(' ').map(n => n[0]).join('')
  }

  if (!data) {
    return (
      <>
        <TopBar greeting />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#475569', fontSize: 14 }}>Loading...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <TopBar greeting />

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
            <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: '#1E293B' }}>Today&apos;s Appointments</h2>
            <div>
              {data.appointments.map((apt, i) => (
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
              {data.recentPatients.map((p, i) => (
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
          {data.lowStock.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#1E293B' }}>{item.drug}</span>
              <span style={{ padding: '3px 12px', borderRadius: 999, backgroundColor: '#F59E0B', color: 'white', fontSize: 12, fontWeight: 600 }}>{item.qty} Left</span>
              <button style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: '#0D7377', border: 'none', color: 'white', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>+</button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
