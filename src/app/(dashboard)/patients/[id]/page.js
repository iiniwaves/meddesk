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

  return (
    <>
      <TopBar title="Patient's Profile" onBack={() => router.back()} />

      <main className="p-4 md:p-7 flex-1">

        {/* Profile card */}
        <div className="bg-white rounded-xl p-5 md:p-7 mb-6 border border-[#F1F5F9] shadow-sm">
          {/* Name row */}
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-full bg-[#E6F4F4] border-2 border-[#0D7377] flex items-center justify-center flex-shrink-0">
              <span className="text-base font-bold text-[#0D7377]">{getInitials(fullName)}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-[#1E293B] m-0">{fullName}</h1>
          </div>

          {/* Info row — wraps gracefully */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mb-3">
            <span className="text-sm text-[#475569]">{patient.patientNo}</span>
            <span className="text-sm text-[#475569]">{age}</span>
            <span className="text-sm text-[#475569]">{patient.gender}</span>
            <span className="text-sm text-[#475569]">{patient.bloodGroup}</span>
            <span className="text-sm text-[#475569] truncate">{patient.phone}</span>
          </div>

          {/* Allergies + Action buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-[#475569]">Allergies:</span>
              {(patient.allergies || []).length > 0
                ? (patient.allergies || []).map((a, i) => (
                    <span key={i} className="px-3 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: i === 0 ? '#EF4444' : '#F59E0B' }}>{a}</span>
                  ))
                : <span className="text-sm text-[#94A3B8]">None</span>
              }
            </div>
            <div className="flex flex-wrap gap-2.5 shrink-0">
              <button className="px-5 py-2.5 bg-[#0D7377] text-white border-none rounded-lg text-sm font-semibold cursor-pointer">New Appointment</button>
              <button className="px-5 py-2.5 bg-white text-[#1E293B] border border-[#E2E8F0] rounded-lg text-sm cursor-pointer">New Consultation</button>
              <button className="px-5 py-2.5 bg-white text-[#1E293B] border border-[#E2E8F0] rounded-lg text-sm cursor-pointer">New Invoice</button>
              <span className="text-sm font-semibold text-[#1E293B] cursor-pointer self-center">Print Record</span>
            </div>
          </div>
        </div>

        {/* Tabs + table */}
        <div className="bg-white rounded-xl border border-[#F1F5F9] shadow-sm overflow-hidden">
          {/* Tab bar — scrollable on mobile */}
          <div className="overflow-x-auto border-b border-[#E2E8F0] px-5">
            <div className="flex min-w-max">
              {tabs.map(tab => {
                const tabKey = tab.toLowerCase().replace(' ', '')
                const active = activeTab === tabKey
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tabKey)}
                    className={[
                      'py-4 px-4 text-sm whitespace-nowrap border-b-2 transition-colors cursor-pointer',
                      active ? 'border-[#0D7377] text-[#0D7377] font-semibold' : 'border-transparent text-[#475569] font-normal hover:text-[#1E293B]',
                    ].join(' ')}
                  >
                    {tab}
                  </button>
                )
              })}
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="overflow-x-auto">
              <div className="grid grid-cols-[1fr_1fr_1fr_70px] min-w-[600px] bg-[#0D7377] py-3.5 px-5">
                {['Date', 'Attending Doctor', 'Complaint', ''].map((h, i) => (
                  <span key={i} className="text-sm font-semibold text-white truncate">{h}</span>
                ))}
              </div>
              {visits.length === 0 && (
                <div className="py-12 px-5 text-center text-sm text-[#94A3B8]">
                  No visit records yet.
                </div>
              )}
              {visits.map((v, i) => (
                <div key={i} className={[
                  'grid grid-cols-[1fr_1fr_1fr_70px] min-w-[600px]',
                  'py-4 px-5 items-center',
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
          )}

          {activeTab !== 'overview' && (
            <div className="py-12 px-5 text-center text-sm text-[#94A3B8]">
              No {tabs.find(t => t.toLowerCase().replace(' ', '') === activeTab)} records yet.
            </div>
          )}
        </div>

      </main>
    </>
  )
}
