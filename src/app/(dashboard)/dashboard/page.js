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
        { value: String(data.lowStock.length), label: 'Inventory Alert', trend: 'down', trendText: `${data.lowStock.length} item${data.lowStock.length > 1 ? 's' : ''} low` },
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

      <main className="p-4 md:p-7 pb-4 md:pb-7 flex-1 overflow-y-auto">

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map(stat => (
            <div key={stat.label} className={[
              'bg-white rounded-xl border border-[#F1F5F9] shadow-sm p-4 md:p-5',
              // Mobile: horizontal card layout — value prominent, label to the side
              'flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-4',
            ].join(' ')}>
              {/* Label — mobile: top-left | desktop: top */}
              <div className="mb-2 sm:mb-0 sm:order-1">
                <p className="text-sm text-[#94A3B8] m-0">{stat.label}</p>
                <p className="text-2xl md:text-3xl font-bold text-[#1E293B] tracking-tight mt-1">{stat.value}</p>
              </div>

              {/* Trend — mobile: below value | desktop: right side */}
              <div className={['inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
                stat.trend === 'up' ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FEE2E2] text-[#991B1B]',
                'sm:order-2',
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

        {/* ── Middle Row: Appointments + Recent Patients ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

          {/* Appointments */}
          <div className="bg-white rounded-xl border border-[#F1F5F9] shadow-sm p-4 md:p-5">
            <h2 className="m-0 mb-4 text-base md:text-lg font-bold text-[#1E293B]">Today&apos;s Appointments</h2>

            <div className="space-y-0">
              {data.appointments.slice(0, 4).map((apt, i) => (
                <div key={i} className={[
                  'flex items-center gap-3 py-3',
                  i > 0 && 'border-t border-[#F1F5F9]',
                ].join(' ')}>
                  {/* Patient */}
                  <span className="flex-1 min-w-0 text-sm text-[#1E293B] truncate">{apt.patient}</span>
                  {/* Time */}
                  <span className="w-16 md:w-20 text-xs md:text-sm text-[#64748B] shrink-0 text-right tabular-nums hidden sm:block">{apt.time}</span>
                  {/* Doctor — hide on small screens */}
                  <span className="hidden lg:block w-28 text-xs md:text-sm text-[#64748B] shrink-0 truncate pr-2">{apt.doctor}</span>
                  {/* Status badge */}
                  <span className={[
                    'px-2.5 py-1 rounded-full text-xs font-semibold shrink-0',
                    apt.status === 'done' ? 'bg-[#22C55E]/10 text-[#15803D]' :
                    apt.status === 'pending' ? 'bg-[#F59E0B]/10 text-[#B45309]' :
                    'bg-[#0D7377]/10 text-[#0D7377]',
                  ].join(' ')}>
                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 text-right">
              <a href="/appointments" className="text-sm text-[#0D7377] underline">View All</a>
            </div>
          </div>

          {/* Recent Patients */}
          <div className="bg-white rounded-xl border border-[#F1F5F9] shadow-sm p-4 md:p-5">
            <h2 className="m-0 mb-4 text-base md:text-lg font-bold text-[#1E293B]">Recent Patients</h2>

            <div className="space-y-0">
              {data.recentPatients.slice(0, 4).map((p, i) => (
                <div key={i} className={[
                  'py-3',
                  i > 0 && 'border-t border-[#F1F5F9]',
                ].join(' ')}>
                  {/* Mobile: avatar + name on one line, info stacked below */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#E6F4F4] flex items-center justify-center flex-shrink-0">
                      <span className="text-xs md:text-sm font-bold text-[#0D7377]">{getInitials(p.name)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-sm text-[#1E293B] block truncate">{p.name}</span>
                      <span className="text-xs text-[#94A3B8] sm:hidden">{p.info}</span>
                    </div>
                    {/* Info only visible on tablet+ */}
                    <span className="hidden sm:inline text-xs md:text-sm text-[#94A3B8] shrink-0">{p.info}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-right">
              <a href="/patients" className="text-sm text-[#0D7377] underline">View All</a>
            </div>
          </div>
        </div>

        {/* ── Low Stock Alerts ── */}
        {data.lowStock.length > 0 && (
          <div className="bg-white rounded-xl border border-[#F1F5F9] shadow-sm overflow-hidden">
            <div className="bg-[#FEF3C7] px-4 py-3 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span className="text-sm font-semibold text-[#B45309]">Low Stock Alert</span>
            </div>

            {/* Desktop: horizontal scrollable bar */}
            <div className="hidden md:flex items-center gap-3 px-5 py-3 overflow-x-auto">
              {data.lowStock.map((item, i) => (
                <div key={i} className="flex items-center gap-2 shrink-0">
                  <span className="text-sm text-[#1E293B]">{item.drug}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F59E0B] text-white text-xs font-semibold whitespace-nowrap">{item.qty} Left</span>
                  <button className="w-6 h-6 rounded-full bg-[#0D7377] border-none text-white text-sm cursor-pointer flex items-center justify-center leading-none">+</button>
                </div>
              ))}
            </div>

            {/* Mobile: vertical list of alert chips */}
            <div className="md:hidden divide-y divide-[#F1F5F9]">
              {data.lowStock.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm text-[#1E293B]">{item.drug}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#B45309] text-xs font-semibold">{item.qty} Left</span>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-[#0D7377] border-none text-white text-lg cursor-pointer flex items-center justify-center leading-none active:bg-[#085050]">+</button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </>
  )
}
