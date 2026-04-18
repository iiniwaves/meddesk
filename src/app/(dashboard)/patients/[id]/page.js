'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PatientProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [patient, setPatient] = useState(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (params.id) {
      fetch(`/api/patients/${params.id}`)
        .then(r => r.json())
        .then(data => setPatient(data))
    }
  }, [params.id])

  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest('[data-usermenu]')) setShowUserMenu(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  if (status === 'loading' || !patient) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#475569', fontSize: 14 }}>Loading...</p>
      </div>
    )
  }

  function getInitials(name) {
    if (!name) return 'MD'
    return name.split(' ').map(n => n[0]).join('')
  }

  const fullName = `${patient.firstName} ${patient.lastName}`
  const tabs = ['Overview', 'Visit History', 'Prescriptions', 'Invoices', 'Notes']

  const visits = [
    { date: '09/01/26', doctor: 'Dr Danladi', complaint: 'Fever & Headache' },
    { date: '09/01/26', doctor: 'Dr Danladi', complaint: 'Fever & Headache' },
    { date: '09/01/26', doctor: 'Dr Danladi', complaint: 'Fever & Headache' },
    { date: '09/01/26', doctor: 'Dr Danladi', complaint: 'Fever & Headache' },
  ]

  const navTop = [
    { label: 'Dashboard', icon: HomeIcon, href: '/dashboard' },
    { label: 'Patients', icon: PatientIcon, href: '/patients', active: true },
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
        <div style={{ padding: '24px 20px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#0D7377', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#4ADE80', fontSize: 18 }}>★</span>
            </div>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 17 }}>MedicDesk</span>
          </div>
        </div>

        <nav style={{ padding: '0 16px' }}>
          {navTop.map(item => (
            <a key={item.label} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 16px', marginBottom: 8,
              textDecoration: 'none', color: 'white',
              backgroundColor: item.active ? '#0D7377' : 'transparent',
              borderRadius: 10, fontSize: 14,
              fontWeight: item.active ? 600 : 400,
              opacity: item.active ? 1 : 0.7,
            }}>
              <item.icon active={item.active} />
              {item.label}
            </a>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        <nav style={{ padding: '0 16px' }}>
          {navBottom.map(item => (
            <a key={item.label} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 16px', marginBottom: 8,
              textDecoration: 'none', color: 'white',
              borderRadius: 10, fontSize: 14,
              fontWeight: 400, opacity: 0.7,
            }}>
              <item.icon active={false} />
              {item.label}
            </a>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        <div style={{ padding: '0 16px 40px' }}>
          <a href="/settings" style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '12px 16px', textDecoration: 'none',
            color: 'white', borderRadius: 10, fontSize: 14, opacity: 0.7,
          }}>
            <SettingsIcon active={false} />
            Settings
          </a>
        </div>
      </div>

      {/* Main */}
      <div style={{ marginLeft: 216, flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Top bar */}
        <div style={{ height: 64, backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span onClick={() => router.back()} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </span>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1E293B' }}>Patient's Profile</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ cursor: 'pointer', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '1px solid #E2E8F0' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <div data-usermenu="true" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', position: 'relative' }} onClick={() => setShowUserMenu(!showUserMenu)}>
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
                  <button onClick={() => signOut({ callbackUrl: '/login' })} style={{ width: '100%', padding: '10px 16px', backgroundColor: 'transparent', border: 'none', textAlign: 'left', fontSize: 13, color: '#EF4444', cursor: 'pointer' }}>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 28px' }}>

          {/* Profile card */}
          <div style={{ backgroundColor: 'white', borderRadius: 12, padding: '24px 28px', marginBottom: 24, border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#E6F4F4', border: '2px solid #0D7377', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#0D7377' }}>{getInitials(fullName)}</span>
              </div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1E293B' }}>{fullName}</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: '#475569' }}>{patient.patientNo}</span>
              <span style={{ fontSize: 13, color: '#475569' }}>{patient.dateOfBirth ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear() : '—'}</span>
              <span style={{ fontSize: 13, color: '#475569' }}>{patient.gender}</span>
              <span style={{ fontSize: 13, color: '#475569' }}>{patient.bloodGroup}</span>
              <span style={{ fontSize: 13, color: '#475569' }}>{patient.phone}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: '#475569' }}>Allergies:</span>
                {patient.allergies.length > 0 ? patient.allergies.map((a, i) => (
                  <span key={i} style={{ padding: '3px 12px', borderRadius: 999, backgroundColor: i === 0 ? '#EF4444' : '#F59E0B', color: 'white', fontSize: 12, fontWeight: 500 }}>{a}</span>
                )) : <span style={{ fontSize: 13, color: '#94A3B8' }}>None</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button style={{ padding: '10px 20px', backgroundColor: '#0D7377', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>New Appointment</button>
                <button style={{ padding: '10px 20px', backgroundColor: 'white', color: '#1E293B', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>New Consultation</button>
                <button style={{ padding: '10px 20px', backgroundColor: 'white', color: '#1E293B', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>New Invoice</button>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', cursor: 'pointer' }}>Print Record</span>
              </div>
            </div>
          </div>

          {/* Tabs + table */}
          <div style={{ backgroundColor: 'white', borderRadius: 12, border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', padding: '0 24px' }}>
              {tabs.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab.toLowerCase().replace(' ', ''))} style={{
                  padding: '16px 16px 14px', marginRight: 8,
                  background: 'none', border: 'none',
                  borderBottom: activeTab === tab.toLowerCase().replace(' ', '') ? '2px solid #0D7377' : '2px solid transparent',
                  fontSize: 14,
                  fontWeight: activeTab === tab.toLowerCase().replace(' ', '') ? 600 : 400,
                  color: activeTab === tab.toLowerCase().replace(' ', '') ? '#0D7377' : '#475569',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                }}>
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 80px', backgroundColor: '#0D7377', padding: '14px 24px' }}>
                  {['Date', 'Attending Doctor', 'Complaint', ''].map((h, i) => (
                    <span key={i} style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{h}</span>
                  ))}
                </div>
                {visits.map((v, i) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 80px',
                    padding: '16px 24px',
                    backgroundColor: i % 2 === 0 ? 'white' : '#F0FAF9',
                    borderBottom: i === visits.length - 1 ? 'none' : '1px solid #F1F5F9',
                    alignItems: 'center',
                  }}>
                    <span style={{ fontSize: 14, color: '#1E293B' }}>{v.date}</span>
                    <span style={{ fontSize: 14, color: '#1E293B' }}>{v.doctor}</span>
                    <span style={{ fontSize: 14, color: '#1E293B' }}>{v.complaint}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#0D7377' }}>View</span>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0D7377" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab !== 'overview' && (
              <div style={{ padding: '48px 24px', textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>
                No {tabs.find(t => t.toLowerCase().replace(' ', '') === activeTab)} records yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function HomeIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
}
function PatientIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
}
function CalendarIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg>
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