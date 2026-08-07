'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import TopBar from '@/components/TopBar'

export default function PatientProfilePage() {
  const router = useRouter()
  const params = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [patient, setPatient] = useState(null)

  useEffect(() => {
    if (params.id) {
      fetch(`/api/patients/${params.id}`)
        .then(r => r.json())
        .then(data => setPatient(data))
    }
  }, [params.id])

  if (!patient) {
    return (
      <>
        <TopBar title="Patient's Profile" onBack={() => router.back()} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-[#475569]">Loading...</p>
        </div>
      </>
    )
  }

  function getInitials(name) {
    if (!name) return 'MD'
    return name.split(' ').map(n => n[0]).join('')
  }

  const fullName = `${patient.firstName} ${patient.lastName}`
  const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
  const tabs = ['Overview', 'Visit History', 'Prescriptions', 'Invoices', 'Notes']
  const visits = patient.visits || []

  // ── Mobile Visit Card ──
  function VisitCard({ v, i }) {
    return (
      <div className={[
        'bg-white border border-[#E2E8F0] shadow-sm rounded-xl p-4 mb-2',
        i % 2 === 0 ? '' : 'sm:bg-[#F0FAF9]',
      ].join(' ')}>
        {/* Date & Doctor */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-[#1E293B]">{new Date(v.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <span className="text-xs text-[#64748B] shrink-0">{v.doctorName}</span>
        </div>
        {/* Complaint */}
        <p className="text-sm text-[#1E293B] mb-2 leading-relaxed">{v.complaint}</p>
        {/* View action */}
        <button className="w-full h-11 bg-[#0D7377] hover:bg-[#085050] text-white text-sm font-medium rounded-lg cursor-pointer transition-colors active:bg-[#085050]">View Details</button>
      </div>
    )
  }

  return (
    <>
      <TopBar title="Patient's Profile" onBack={() => router.back()} />

      <main className="p-4 md:p-7 pb-4 md:pb-7 flex-1 overflow-y-auto">

        {/* ── Profile Header ── */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5 md:p-7 mb-5">
          {/* Avatar + Name — center on mobile */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-full bg-[#E6F4F4] border-2 border-[#0D7377] flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
              <span className="text-base font-bold text-[#0D7377]">{getInitials(fullName)}</span>
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-[#1E293B] m-0">{fullName}</h1>
              <p className="text-sm text-[#94A3B8] mt-0.5">{patient.patientNo}</p>
            </div>
          </div>

          {/* Info chips — wraps naturally */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-5">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#F1F5F9] text-xs text-[#475569]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              {age} yrs
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#F1F5F9] text-xs text-[#475569]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              {patient.gender}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#F1F5F9] text-xs text-[#475569]">
              {patient.bloodGroup}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#F1F5F9] text-xs text-[#475569]">
              {patient.phone}
            </span>
          </div>

          {/* Allergies */}
          <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start mb-5">
            <span className="text-xs text-[#64748B]">Allergies:</span>
            {(patient.allergies || []).length > 0
              ? (patient.allergies || []).map((a, i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: i === 0 ? '#EF4444' : '#F59E0B' }}>{a}</span>
                ))
              : <span className="text-xs text-[#94A3B8]">None</span>
            }
          </div>

          {/* Action buttons — 2×2 grid on mobile, horizontal row on tablet+ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button className="col-span-2 sm:col-span-1 h-11 bg-[#0D7377] hover:bg-[#085050] text-white text-sm font-medium rounded-lg cursor-pointer transition-colors active:bg-[#085050]">New Appointment</button>
            <button className="col-span-1 sm:col-span-1 h-11 bg-white text-[#1E293B] border border-[#E2E8F0] text-sm rounded-lg cursor-pointer transition-colors active:bg-[#F8FAFC]">New Consultation</button>
            <button className="col-span-1 sm:col-span-1 h-11 bg-white text-[#1E293B] border border-[#E2E8F0] text-sm rounded-lg cursor-pointer transition-colors active:bg-[#F8FAFC]">New Invoice</button>
            <button className="col-span-2 sm:col-span-1 h-11 bg-white text-[#1E293B] border border-[#E2E8F0] text-sm font-medium rounded-lg cursor-pointer transition-colors active:bg-[#F8FAFC] sm:hidden">Print Record</button>
            <span className="hidden sm:inline text-sm font-medium text-[#1E293B] self-center cursor-pointer">Print Record</span>
          </div>
        </div>

        {/* ── Tabs + Content ── */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          {/* Tab bar — scrollable on mobile */}
          <div className="overflow-x-auto border-b border-[#E2E8F0]">
            <div className="flex min-w-max px-4">
              {tabs.map(tab => {
                const tabKey = tab.toLowerCase().replace(' ', '')
                const active = activeTab === tabKey
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tabKey)}
                    className={[
                      'py-3.5 px-4 text-sm whitespace-nowrap border-b-2 transition-colors cursor-pointer',
                      active ? 'border-[#0D7377] text-[#0D7377] font-semibold' : 'border-transparent text-[#64748B] font-normal hover:text-[#1E293B]',
                    ].join(' ')}
                  >
                    {tab}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content area */}
          {activeTab === 'overview' && (
            <>
              {/* Desktop table header — hidden on mobile */}
              <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_70px] bg-[#0D7377] py-3.5 px-5 gap-4 items-center">
                {['Date', 'Attending Doctor', 'Complaint', ''].map((h, i) => (
                  <span key={i} className="text-sm font-semibold text-white truncate">{h}</span>
                ))}
              </div>

              {visits.length === 0 ? (
                <div className="py-12 text-center text-sm text-[#94A3B8]">No visit records yet.</div>
              ) : (
                <>
                  {/* Mobile: card layout */}
                  <div className="md:hidden divide-y divide-[#F1F5F9]">
                    {visits.map((v, i) => <VisitCard key={i} v={v} i={i} />)}
                  </div>

                  {/* Desktop: table rows */}
                  <div className="hidden md:block">
                    {visits.map((v, i) => (
                      <div key={i} className={[
                        'grid grid-cols-[1fr_1fr_1fr_70px] py-4 px-5 gap-4 items-center',
                        i % 2 === 0 ? 'bg-white' : 'bg-[#F0FAF9]',
                        i === visits.length - 1 ? '' : 'border-b border-[#F1F5F9]',
                      ].join(' ')}>
                        <span className="text-sm text-[#1E293B] truncate">{new Date(v.date).toLocaleDateString('en-GB')}</span>
                        <span className="text-sm text-[#1E293B] truncate pr-2">{v.doctorName}</span>
                        <span className="text-sm text-[#1E293B] truncate pr-2">{v.complaint}</span>
                        <div className="flex items-center gap-1.5 cursor-pointer">
                          <span className="text-sm font-semibold text-[#0D7377]">View</span>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0D7377" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {activeTab !== 'overview' && (
            <div className="py-12 text-center text-sm text-[#94A3B8]">
              No {tabs.find(t => t.toLowerCase().replace(' ', '') === activeTab)} records yet.
            </div>
          )}
        </div>

      </main>
    </>
  )
}
