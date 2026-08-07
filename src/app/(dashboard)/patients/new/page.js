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

  const doctorMap = {
    'Dr Danladi': 'dr.danladi@medicdesk.com',
    'Dr. Chidi': 'dr.chidi@medicdesk.com',
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
      const parts = formData.patientName.trim().split(' ')
      const firstName = parts[0]
      const lastName = parts.slice(1).join(' ') || ''

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

      const formatTime = (t) => t.replace(/AM|PM/g, '').trim()
      const isPM = formData.time.toUpperCase().includes('PM')
      let [hours, rest] = formatTime(formData.time).split(':').map(Number)
      if (isPM && hours !== 12) hours += 12
      if (!isPM && hours === 12) hours = 0
      const dbTime = `${String(hours).padStart(2, '0')}:${String(rest).padStart(2, '0')}`

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
      }

      router.push('/patients')
    } catch (err) {
      setError(err.message || 'Failed to save patient. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Shared input field component
  function Field({ label, children, className }) {
    return (
      <div className={['mb-6', className].filter(Boolean).join(' ')}>
        <label className="block text-sm font-medium text-[#374151] mb-2">{label}</label>
        {children}
      </div>
    )
  }

  // Shared input style — taller on mobile for better touch targets
  function inputStyle(hasIcon = false) {
    return {
      width: '100%',
      height: 52,
      padding: `0 ${hasIcon ? 40 : 14}px`,
      border: '1px solid #D1D5DB',
      borderRadius: 10,
      fontSize: 15,
      color: '#1F2937',
      outline: 'none',
      backgroundColor: 'white',
      boxSizing: 'border-box',
    }
  }

  return (
    <>
      <TopBar title="Patients" onBack={() => router.back()} />

      {/* Scrollable content area */}
      <main className="p-4 pb-28 md:pb-10 flex-1 overflow-y-auto">

        {/* Page heading — more prominent on mobile */}
        <div className="mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-[#111827] m-0">Add New Patient</h1>
          <p className="text-sm text-[#64748B] mt-1 hidden md:block">Fill in the patient details below.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="w-full max-w-[640px] mx-auto">

            {/* ── Section: Patient Info ── */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 mb-6">
              <Field label="Patient Name">
                <input
                  type="text"
                  placeholder="e.g. Adebayo Johnson"
                  className="transition-shadow focus:ring-2 focus:ring-[#0D7377]/20 focus:border-[#0D7377]"
                  style={inputStyle(false)}
                  value={formData.patientName}
                  onChange={e => setFormData({ ...formData, patientName: e.target.value })}
                />
              </Field>

              <Field label="Doctor">
                <select
                  value={formData.doctor}
                  onChange={e => setFormData({ ...formData, doctor: e.target.value })}
                  className="transition-shadow focus:ring-2 focus:ring-[#0D7377]/20 focus:border-[#0D7377]"
                  style={{ ...inputStyle(), appearance: 'auto', cursor: 'pointer', colorScheme: 'light' }}
                >
                  {doctors.map(d => <option key={d}>{d}</option>)}
                </select>
              </Field>
            </div>

            {/* ── Section: Appointment Details ── */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 mb-6">
              <Field label="Schedule Date">
                <input
                  type="date"
                  className="transition-shadow focus:ring-2 focus:ring-[#0D7377]/20 focus:border-[#0D7377]"
                  style={inputStyle()}
                  value={formData.scheduleDate}
                  onChange={e => setFormData({ ...formData, scheduleDate: e.target.value })}
                />
              </Field>

              <Field label="Time">
                <select
                  value={formData.time}
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                  className="transition-shadow focus:ring-2 focus:ring-[#0D7377]/20 focus:border-[#0D7377]"
                  style={{ ...inputStyle(), appearance: 'auto', cursor: 'pointer', colorScheme: 'light' }}
                >
                  {times.map(t => <option key={t}>{t}</option>)}
                </select>
              </Field>

              <Field label="Visit Type">
                <select
                  value={formData.visitType}
                  onChange={e => setFormData({ ...formData, visitType: e.target.value })}
                  className="transition-shadow focus:ring-2 focus:ring-[#0D7377]/20 focus:border-[#0D7377]"
                  style={{ ...inputStyle(), appearance: 'auto', cursor: 'pointer', colorScheme: 'light' }}
                >
                  {visitTypes.map(v => <option key={v}>{v}</option>)}
                </select>
              </Field>
            </div>

            {/* ── Section: Reason ── */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 mb-6">
              <Field label="Reason For Visit">
                <textarea
                  rows={4}
                  placeholder="Complaints here..."
                  className="resize-none transition-shadow focus:ring-2 focus:ring-[#0D7377]/20 focus:border-[#0D7377]"
                  style={{ ...inputStyle(), padding: '14px', resize: 'vertical', fontFamily: 'inherit' }}
                  value={formData.reason}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                />
              </Field>
            </div>

            {/* Error message */}
            {error && <p className="text-sm text-[#EF4444] mb-4 px-4 bg-[#FEF2F2] border border-[#FECACA] rounded-lg py-2.5">{error}</p>}
          </div>
        </form>
      </main>

      {/* ── Sticky Save Bar (mobile) ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] z-30">
        <button
          type="submit"
          onClick={() => document.querySelector('form').requestSubmit()}
          disabled={loading}
          className={[
            'w-full h-12 rounded-lg text-base font-semibold text-white border-none cursor-pointer transition-colors',
            loading ? 'bg-[#6B7280]' : 'bg-[#0D7377] active:bg-[#085050]',
          ].join(' ')}
        >
          {loading ? 'Saving...' : 'Save Patient'}
        </button>
      </div>

      {/* Desktop Save Button */}
      <div className="hidden md:flex w-full max-w-[640px] mx-auto mt-4 justify-end">
        <button
          type="submit"
          onClick={() => document.querySelector('form').requestSubmit()}
          disabled={loading}
          className="h-12 bg-[#0D7377] hover:bg-[#085050] text-white border-none rounded-lg text-base font-semibold cursor-pointer px-8 transition-colors"
        >
          {loading ? 'Saving...' : 'Save Patient'}
        </button>
      </div>
    </>
  )
}
