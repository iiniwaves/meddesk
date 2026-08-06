'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import TopBar from '@/components/TopBar'

export default function NewPatientPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    patientName: '',
    doctor: 'Dr Danladi',
    scheduleDate: '',
    time: '08:00AM',
    visitType: 'Walk-In',
    reason: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const doctors = ['Dr Danladi', 'Dr. Chidi']
  const visitTypes = ['Walk-In', 'Appointment', 'Referral', 'Emergency']
  const times = [
    '07:00AM', '08:00AM', '09:00AM', '10:00AM', '11:00AM',
    '12:00PM', '01:00PM', '02:00PM', '03:00PM', '04:00PM', '05:00PM',
  ]

  function getField(label) {
    return (
      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
        {label}
      </label>
    )
  }

  function inputStyle(hasIcon = false) {
    return {
      width: '100%',
      height: 48,
      padding: `0 ${hasIcon ? 40 : 14}px`,
      border: '1px solid #D1D5DB',
      borderRadius: 8,
      fontSize: 14,
      color: '#1F2937',
      outline: 'none',
      backgroundColor: 'white',
      boxSizing: 'border-box',
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const patientData = {
        patientNo: 'PAT-' + Math.floor(1000 + Math.random() * 9000),
        firstName: formData.patientName.split(' ')[0] || formData.patientName,
        lastName: formData.patientName.split(' ').slice(1).join(' ') || '',
        gender: '',
        phone: '',
        allergies: [],
      }

      await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData),
      })

      // Create appointment linked to the new patient
      // We need the patient ID, but the API doesn't return it directly
      // So we'll just redirect for now — the full flow will link them
    } catch (err) {
      setError('Failed to save patient. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span onClick={() => router.back()} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </span>
        <TopBar title="Patients" />
      </div>

      <div style={{ padding: '32px 40px', flex: 1 }}>

        {/* Title */}
        <h1 style={{ margin: '0 0 32px', fontSize: 24, fontWeight: 700, color: '#111827' }}>Add New Patient</h1>

        <form onSubmit={handleSubmit}>
          <div style={{ maxWidth: 640 }}>
            {/* Patient Name */}
            <div style={{ marginBottom: 24 }}>
              {getField('Patient Name')}
              <div style={{ position: 'relative' }}>
                <input type="text" placeholder="Search" style={inputStyle(true)} value={formData.patientName}
                  onChange={e => setFormData({ ...formData, patientName: e.target.value })} />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
            </div>

            {/* Doctor */}
            <div style={{ marginBottom: 24 }}>
              {getField('Doctor')}
              <select value={formData.doctor}
                onChange={e => setFormData({ ...formData, doctor: e.target.value })}
                style={{ ...inputStyle(), appearance: 'auto', cursor: 'pointer' }}>
                {doctors.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            {/* Schedule Date & Time */}
            <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
              <div style={{ flex: 1 }}>
                {getField('Schedule Date')}
                <input type="date" style={inputStyle(true)}
                  onChange={e => setFormData({ ...formData, scheduleDate: e.target.value })} />
              </div>
              <div style={{ flex: 1 }}>
                {getField('Time')}
                <select value={formData.time}
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                  style={{ ...inputStyle(), appearance: 'auto', cursor: 'pointer' }}>
                  {times.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Visit Type */}
            <div style={{ marginBottom: 24 }}>
              {getField('Visit Type')}
              <select value={formData.visitType}
                onChange={e => setFormData({ ...formData, visitType: e.target.value })}
                style={{ ...inputStyle(), appearance: 'auto', cursor: 'pointer' }}>
                {visitTypes.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>

            {/* Reason For Visit */}
            <div style={{ marginBottom: 32 }}>
              {getField('Reason For Visit')}
              <textarea rows={4} placeholder="Complaints here..."
                style={{ ...inputStyle(), padding: '14px', resize: 'vertical', fontFamily: 'inherit' }}
                value={formData.reason}
                onChange={e => setFormData({ ...formData, reason: e.target.value })} />
            </div>

            {/* Error message */}
            {error && <p style={{ color: '#EF4444', fontSize: 13, marginBottom: 16 }}>{error}</p>}

            {/* Save Button */}
            <button type="submit" disabled={loading}
              style={{
                width: 120,
                height: 44,
                backgroundColor: loading ? '#6B7280' : '#0D7377',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
