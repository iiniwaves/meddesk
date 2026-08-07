'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import TopBar from '@/components/TopBar'

export default function PatientsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [patients, setPatients] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 5, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [openMenu, setOpenMenu] = useState(null)

  function fetchPatients(page = 1, limit = pagination.limit, q = search) {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (q) params.set('search', q)
    fetch(`/api/patients?${params}`)
      .then(r => r.json())
      .then(data => {
        setPatients(data.patients)
        setPagination(data.pagination)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => fetchPatients(1), 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest('[data-menu]')) setOpenMenu(null)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  async function handleDelete(patientNo) {
    if (!confirm('Delete this patient?')) return
    await fetch(`/api/patients/${patientNo}`, { method: 'DELETE' })
    setOpenMenu(null)
    fetchPatients(pagination.page)
  }

  const start = (pagination.page - 1) * pagination.limit + 1
  const end = Math.min(pagination.page * pagination.limit, pagination.total)

  return (
    <>
      <TopBar title="Patients" />

      <div style={{ padding: '24px 28px' }}>

        {/* Search + Filter + Add — stacks on mobile */}
        <div className="flex-col sm:flex-row" style={{ backgroundColor: 'white', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: 8, padding: '10px 14px' }} className="w-full">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: 14, color: '#1E293B', width: '100%', backgroundColor: 'transparent' }}
            />
          </div>
          <button style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0', borderRadius: 8, backgroundColor: 'white', cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="10" y1="18" x2="14" y2="18" />
            </svg>
          </button>
          <button
            onClick={() => router.push('/patients/new')}
            style={{ padding: '10px 20px', backgroundColor: '#0D7377', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Add New Patients
          </button>
        </div>

        {/* Table — horizontally scrollable on mobile */}
        <div style={{ backgroundColor: 'white', borderRadius: 12, overflow: 'hidden', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div className="overflow-x-auto">
            <div style={{ minWidth: 860 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 80px 100px 160px 120px 80px', backgroundColor: '#0D7377', padding: '14px 20px' }}>
            {['ID', 'Full Name', 'Age', 'Gender', 'Phone. No', 'Last Visit', ''].map((h, i) => (
              <span key={i} style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{h}</span>
            ))}
          </div>

          {patients.map((p, i) => {
            const age = new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear()
            return (
              <div key={p.patientNo} style={{
                display: 'grid',
                gridTemplateColumns: '160px 1fr 80px 100px 160px 120px 80px',
                padding: '16px 20px',
                backgroundColor: i % 2 === 0 ? 'white' : '#F0FAF9',
                borderBottom: i === patients.length - 1 ? 'none' : '1px solid #F1F5F9',
                alignItems: 'center',
              }}>
                <span style={{ fontSize: 13, color: '#475569' }}>{p.patientNo}</span>
                <span style={{ fontSize: 14, color: '#1E293B' }}>{p.firstName} {p.lastName}</span>
                <span style={{ fontSize: 14, color: '#1E293B' }}>{age}</span>
                <span style={{ fontSize: 14, color: '#1E293B' }}>{p.gender}</span>
                <span style={{ fontSize: 14, color: '#1E293B' }}>{p.phone}</span>
                <span style={{ fontSize: 14, color: '#1E293B' }}>{new Date(p.createdAt).toLocaleDateString('en-GB')}</span>
                <div style={{ position: 'relative' }} data-menu="true">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      onClick={() => router.push(`/patients/${p.patientNo}`)}
                      style={{ fontSize: 13, fontWeight: 600, color: '#0D7377', cursor: 'pointer' }}
                    >
                      View
                    </span>
                    <svg
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenMenu(openMenu === p.patientNo ? null : p.patientNo)
                      }}
                      width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0D7377" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      style={{ cursor: 'pointer' }}
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  {openMenu === p.patientNo && (
                    <div style={{ position: 'absolute', right: 0, top: 24, backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', minWidth: 160, zIndex: 50 }}>
                      <div onClick={() => { router.push(`/patients/${p.patientNo}`); setOpenMenu(null) }} style={{ padding: '11px 16px', fontSize: 13, color: '#1E293B', cursor: 'pointer', borderBottom: '1px solid #F1F5F9' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >Edit Patient</div>
                      <div onClick={() => { window.print(); setOpenMenu(null) }} style={{ padding: '11px 16px', fontSize: 13, color: '#1E293B', cursor: 'pointer', borderBottom: '1px solid #F1F5F9' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >Print Record</div>
                      <div onClick={() => handleDelete(p.patientNo)} style={{ padding: '11px 16px', fontSize: 13, color: '#EF4444', cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >Delete Patient</div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
            </div>
          </div>
        </div>

      </div>

      {/* Pagination — stacks on mobile */}
      <div className="flex-col sm:flex-row gap-3" style={{ padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: '#475569' }}>
            Showing Results {pagination.total > 0 ? `${start}-${end}` : '0'} of {pagination.total} patients
          </span>
          <select
            value={pagination.limit}
            onChange={e => fetchPatients(1, parseInt(e.target.value))}
            style={{ border: '1px solid #E2E8F0', borderRadius: 6, padding: '4px 8px', fontSize: 13, color: '#1E293B', cursor: 'pointer' }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg
            onClick={() => pagination.page > 1 && fetchPatients(pagination.page - 1)}
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke={pagination.page > 1 ? '#475569' : '#CBD5E1'}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ cursor: pagination.page > 1 ? 'pointer' : 'default' }}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span style={{ fontSize: 13, color: '#475569' }}>Page {pagination.page} of {pagination.totalPages}</span>
          <svg
            onClick={() => pagination.page < pagination.totalPages && fetchPatients(pagination.page + 1)}
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke={pagination.page < pagination.totalPages ? '#0D7377' : '#CBD5E1'}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ cursor: pagination.page < pagination.totalPages ? 'pointer' : 'default' }}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </>
  )
}
