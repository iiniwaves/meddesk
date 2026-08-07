'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import TopBar from '@/components/TopBar'
import { useSession } from 'next-auth/react'

export default function NewPatientPage() {
  const router = useRouter()
  const { data: session } = useSession()
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

  // Map display doctor names to DB IDs
  const doctorMap = {
    'Dr Danladi': 'dr.danladi@medicdesk.com',
    'Dr. Chidi': 'dr.chidi@medicdesk.com',
  }

  function getField(label) {
    return (
      <label className="block text-sm font-medium text-[#374151] mb-1.5">
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
    if (!formData.patientName.trim()) {
      setError('Please enter a patient name.')
      return
    }
    if (!formData.scheduleDate) {
      setError('Please select a schedule date.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Split name into first + last
      const parts = formData.patientName.trim().split(' ')
      const firstName = parts[0]
      const lastName = parts.slice(1).join(' ') || ''

      // Create patient
      const patientRes = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientNo: 'PAT-' + Math.floor(1000 + Math.random() * 9000),
          firstName,
          lastName,
          gender: '',
          phone: '',
          allergies: [],
        }),
      })

      if (!patientRes.ok) {
        const errBody = await patientRes.json()
        throw new Error(errBody.error || `HTTP ${patientRes.status}`)
      }

      const createdPatient = await patientRes.json()

      // Format time for DB (convert "08:00AM" to "08:00")
      const formatTime = (t) => t.replace(/AM|PM/g, '').trim()
      const isPM = formData.time.toUpperCase().includes('PM')
      let [hours, rest] = formatTime(formData.time).split(':').map(Number)
      if (isPM && hours !== 12) hours += 12
      if (!isPM && hours === 12) hours = 0
      const dbTime = `${String(hours).padStart(2, '0')}:${String(rest).padStart(2, '0')}`

      // Schedule an appointment
      const apptRes = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: createdPatient.id,
          doctorEmail: doctorMap[formData.doctor],
          date: formData.scheduleDate,
          time: dbTime,
          status: 'PENDING',
          notes: formData.reason || null,
        }),
      })

      if (!apptRes.ok) {
        const errBody = await apptRes.json()
        console.error('Appointment creation failed:', errBody.error)
        // Still redirect — patient was created successfully
      }

      router.push('/patients')
    } catch (err) {
      setError(err.message || 'Failed to save patient. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <TopBar title="Patients" onBack={() => router.back()} />

      <main className="p-4 md:p-10 flex-1">

        {/* Title */}
        <h1 className="m-0 mb-8 text-2xl font-bold text-[#111827]">Add New Patient</h1>

        <form onSubmit={handleSubmit}>
          <div className="w-full max-w-[640px]">
            {/* Patient Name */}
            <div className="mb-6">
              {getField('Patient Name')}
              <input type="text" placeholder="type name here" style={inputStyle(false)} value={formData.patientName}
                onChange={e => setFormData({ ...formData, patientName: e.target.value })} />
            </div>

            {/* Doctor */}
            <div className="mb-6">
              {getField('Doctor')}
              <select value={formData.doctor}
                onChange={e => setFormData({ ...formData, doctor: e.target.value })}
                style={{ ...inputStyle(), appearance: 'auto', cursor: 'pointer' }}>
                {doctors.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            {/* Schedule Date & Time */}
            <div className="mb-6 flex flex-col sm:flex-row gap-5">
              <div className="flex-1">
                {getField('Schedule Date')}
                <input type="date" style={inputStyle()}
                  value={formData.scheduleDate}
                  onChange={e => setFormData({ ...formData, scheduleDate: e.target.value })} />
              </div>
              <div className="flex-1">
                {getField('Time')}
                <select value={formData.time}
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                  style={{ ...inputStyle(), appearance: 'auto', cursor: 'pointer' }}>
                  {times.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Visit Type */}
            <div className="mb-6">
              {getField('Visit Type')}
              <select value={formData.visitType}
                onChange={e => setFormData({ ...formData, visitType: e.target.value })}
                style={{ ...inputStyle(), appearance: 'auto', cursor: 'pointer' }}>
                {visitTypes.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>

            {/* Reason For Visit */}
            <div className="mb-8">
              {getField('Reason For Visit')}
              <textarea rows={4} placeholder="Complaints here..."
                style={{ ...inputStyle(), padding: '14px', resize: 'vertical', fontFamily: 'inherit' }}
                value={formData.reason}
                onChange={e => setFormData({ ...formData, reason: e.target.value })} />
            </div>

            {/* Error message */}
            {error && <p className="text-sm text-[#EF4444] mb-4">{error}</p>}

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

      </main>
    </>
  )
}
