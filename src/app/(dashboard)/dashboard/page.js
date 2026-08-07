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

  function getInitials(name) {
    if (!name) return 'MD'
    return name.split(' ').map(n => n[0]).join('')
  }

  if (!data) {
    return (
      <>
        <TopBar greeting />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-[#475569]">Loading...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <TopBar greeting />

      <main className="p-4 md:p-7 flex-1">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-[#F1F5F9]">
              <div className="flex justify-between items-start mb-2.5">
                <p className="text-sm text-[#94A3B8] m-0">{stat.label}</p>
                <button className="bg-none border-none cursor-pointer p-0 text-[#CBD5E1] text-lg leading-none">⋮</button>
              </div>
              <p className="m-0 mb-3 text-3xl font-bold text-[#1E293B] tracking-tight">{stat.value}</p>
              <div className={[
                'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
                stat.trend === 'up' ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FEE2E2] text-[#991B1B]',
              ].join(' ')}>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

          {/* Appointments */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-[#F1F5F9]">
            <h2 className="m-0 mb-5 text-lg font-bold text-[#1E293B]">Today&apos;s Appointments</h2>
            <div>
              {data.appointments.map((apt, i) => (
                <div key={i} className={[
                  'flex items-center py-3',
                  i === 0 ? '' : 'border-t border-[#F8FAFC]',
                ].join(' ')}>
                  <span className="flex-1 text-sm text-[#1E293B] truncate pr-2">{apt.patient}</span>
                  <span className="w-20 text-sm text-[#64748B] shrink-0 text-right">{apt.time}</span>
                  <span className="w-24 hidden lg:block text-sm text-[#64748B] shrink-0 text-right pr-2">{apt.doctor}</span>
                  <span className={[
                    'px-3.5 py-1 rounded-full text-xs font-semibold shrink-0',
                    apt.status === 'done' ? 'bg-[#22C55E] text-white' :
                    apt.status === 'pending' ? 'bg-[#F59E0B] text-white' :
                    'bg-[#0D7377] text-white',
                  ].join(' ')}>
                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <a href="/appointments" className="text-sm text-[#0D7377] underline">View All Appointments</a>
            </div>
          </div>

          {/* Recent Patients */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-[#F1F5F9]">
            <h2 className="m-0 mb-5 text-lg font-bold text-[#1E293B]">Recent Patients</h2>
            <div>
              {data.recentPatients.map((p, i) => (
                <div key={i} className={[
                  'flex items-center py-3',
                  i === 0 ? '' : 'border-t border-[#F8FAFC]',
                ].join(' ')}>
                  <div className="w-9 h-9 rounded-full bg-[#E6F4F4] flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-sm font-bold text-[#0D7377]">{getInitials(p.name)}</span>
                  </div>
                  <span className="flex-1 text-sm text-[#1E293B] truncate pr-2">{p.name}</span>
                  <span className="text-sm text-[#94A3B8] shrink-0">{p.info}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <a href="/patients" className="text-sm text-[#0D7377] underline">View All Patients</a>
            </div>
          </div>
        </div>

      </main>

      {/* Low Stock Bar */}
      <div className="bg-white border-t border-[#E2E8F0] py-3.5 px-4 md:px-7 flex items-center gap-5 shrink-0 overflow-x-auto">
        <span className="text-sm font-bold text-[#EF4444] whitespace-nowrap">Low Stock Alert!</span>
        <div className="flex gap-3 min-w-0 flex-1">
          {data.lowStock.map((item, i) => (
            <div key={i} className="flex items-center gap-2 shrink-0">
              <span className="text-sm text-[#1E293B]">{item.drug}</span>
              <span className="px-3 py-0.5 rounded-full bg-[#F59E0B] text-white text-xs font-semibold whitespace-nowrap">{item.qty} Left</span>
              <button className="w-5.5 h-5.5 rounded-full bg-[#0D7377] border-none text-white text-sm cursor-pointer flex items-center justify-center leading-none" style={{ minWidth: 22, minHeight: 22 }}>+</button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
