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
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#475569', fontSize: 14 }}>Loading...</p>
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

      <div style={{ padding: '24px 28px' }}>

        {/* Profile card */}
        <div style={{ backgroundColor: 'white', borderRadius: 12, padding: '24px 28px', marginBottom: 24, border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#E6F4F4', border: '2px solid #0D7377', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#0D7377' }}>{getInitials(fullName)}</span>
            </div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1E293B' }}>{fullName}</h1>
          </div>
          <div className="flex-wrap" style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: '#475569' }}>{patient.patientNo}</span>
            <span style={{ fontSize: 13, color: '#475569' }}>{age}</span>
            <span style={{ fontSize: 13, color: '#475569' }}>{patient.gender}</span>
            <span style={{ fontSize: 13, color: '#475569' }}>{patient.bloodGroup}</span>
            <span style={{ fontSize: 13, color: '#475569' }}>{patient.phone}</span>
          </div>
          <div className="flex-col md:flex-row gap-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="flex-wrap" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#475569' }}>Allergies:</span>
              {(patient.allergies || []).length > 0
                ? (patient.allergies || []).map((a, i) => (
                    <span key={i} style={{ padding: '3px 12px', borderRadius: 999, backgroundColor: i === 0 ? '#EF4444' : '#F59E0B', color: 'white', fontSize: 12, fontWeight: 500 }}>{a}</span>
                  ))
                : <span style={{ fontSize: 13, color: '#94A3B8' }}>None</span>
              }
            </div>
            <div className="flex-wrap" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button style={{ padding: '10px 20px', backgroundColor: '#0D7377', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>New Appointment</button>
              <button style={{ padding: '10px 20px', backgroundColor: 'white', color: '#1E293B', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>New Consultation</button>
              <button style={{ padding: '10px 20px', backgroundColor: 'white', color: '#1E293B', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>New Invoice</button>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', cursor: 'pointer' }}>Print Record</span>
            </div>
          </div>
        </div>

        {/* Tabs + table */}
        <div style={{ backgroundColor: 'white', borderRadius: 12, border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div className="overflow-x-auto" style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', padding: '0 24px' }}>
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
            <div className="overflow-x-auto">
              <div style={{ minWidth: 640 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 80px', backgroundColor: '#0D7377', padding: '14px 24px' }}>
                {['Date', 'Attending Doctor', 'Complaint', ''].map((h, i) => (
                  <span key={i} style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{h}</span>
                ))}
              </div>
              {visits.length === 0 && (
                <div style={{ padding: '48px 24px', textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>
                  No visit records yet.
                </div>
              )}
              {visits.map((v, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 80px',
                  padding: '16px 24px',
                  backgroundColor: i % 2 === 0 ? 'white' : '#F0FAF9',
                  borderBottom: i === visits.length - 1 ? 'none' : '1px solid #F1F5F9',
                  alignItems: 'center',
                }}>
                  <span style={{ fontSize: 14, color: '#1E293B' }}>{new Date(v.date).toLocaleDateString('en-GB')}</span>
                  <span style={{ fontSize: 14, color: '#1E293B' }}>{v.doctorName}</span>
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
            </div>
          )}

          {activeTab !== 'overview' && (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>
              No {tabs.find(t => t.toLowerCase().replace(' ', '') === activeTab)} records yet.
            </div>
          )}
        </div>
      </div>
    </>
  )
}
