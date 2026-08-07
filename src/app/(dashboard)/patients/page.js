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

      <main className="p-4 md:p-7 flex-1">

        {/* Search + Filter + Add */}
        <div className={[
          'bg-white rounded-xl p-4 mb-6 border border-[#F1F5F9] shadow-sm',
          'flex flex-col sm:flex-row gap-3',
        ].join(' ')}>
          {/* Search input */}
          <div className="flex items-center gap-2.5 bg-white border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 flex-1 min-w-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border-none outline-none text-sm text-[#1E293B] w-full bg-transparent placeholder:text-[#94A3B8]"
              style={{ colorScheme: 'light' }}
            />
          </div>

          {/* Filter button */}
          <button className="w-10 h-10 flex items-center justify-center border border-[#E2E8F0] rounded-lg bg-white cursor-pointer shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="10" y1="18" x2="14" y2="18" />
            </svg>
          </button>

          {/* Add New button */}
          <button
            onClick={() => router.push('/patients/new')}
            className="px-5 py-2.5 bg-[#0D7377] text-white border-none rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap"
          >
            Add New Patients
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl overflow-hidden border border-[#F1F5F9] shadow-sm">
          <div className="overflow-x-auto">
            {/* Desktop header row */}
            <div className="hidden md:grid grid-cols-[80px_1fr_50px_80px_minmax(100px,_1fr)_120px_70px] bg-[#0D7377] py-3.5 px-5 gap-4 items-center">
              {['ID', 'Full Name', 'Age', 'Gender', 'Phone. No', 'Last Visit', ''].map((h, i) => (
                <span key={i} className="text-sm font-semibold text-white truncate">{h}</span>
              ))}
            </div>

            {/* Mobile header bar (compact labels) */}
            <div className="md:hidden bg-[#0D7377] py-2.5 px-4 flex justify-between shrink-0">
              <span className="text-xs font-semibold text-white/90">ID &amp; Name</span>
              <span className="text-xs font-semibold text-white/90">Age/Gender</span>
              <span className="text-xs font-semibold text-white/90">Phone</span>
              <span className="text-xs font-semibold text-white/90">Visit</span>
              <span></span>
            </div>

            {/* Patient rows */}
            {patients.map((p, i) => {
              const age = new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear()
              return (
                <div key={p.patientNo} className={[
                  'block md:grid md:grid-cols-[80px_1fr_50px_80px_minmax(100px,_1fr)_120px_70px] gap-4 items-center',
                  'py-4 px-5',
                  i % 2 === 0 ? 'bg-white' : 'bg-[#F0FAF9]',
                  i === patients.length - 1 ? '' : 'border-b border-[#F1F5F9]',
                ].join(' ')}>
                  {/* Mobile: compact stacked display */}
                  <div className="md:hidden flex items-start gap-3 mb-2">
                    <span className="text-xs text-[#475569] shrink-0">{p.patientNo}</span>
                    <span className="text-sm text-[#1E293B] font-medium truncate">{p.firstName} {p.lastName}</span>
                  </div>
                  {/* Desktop columns */}
                  <>
                    <span className="hidden md:block text-sm text-[#475569] truncate">{p.patientNo}</span>
                    <span className="hidden md:block text-sm text-[#1E293B] truncate pr-2">{p.firstName} {p.lastName}</span>
                    <span className="hidden md:block text-sm text-[#1E293B]">{age}</span>
                    <span className="hidden md:block text-sm text-[#1E293B]">{p.gender}</span>
                    <span className="hidden md:block text-sm text-[#1E293B] truncate">{p.phone}</span>
                    <span className="hidden md:block text-sm text-[#1E293B]">{new Date(p.createdAt).toLocaleDateString('en-GB')}</span>
                  </>
                  {/* Mobile detail line */}
                  <div className="flex items-center gap-3 text-xs text-[#475569] shrink-0 md:hidden mt-1">
                    <span>{age} / {p.gender}</span>
                    <span className="truncate">{p.phone}</span>
                    <span>{new Date(p.createdAt).toLocaleDateString('en-GB')}</span>
                  </div>
                  {/* Actions always last */}
                  <div style={{ position: 'relative' }} data-menu="true" className={i === patients.length - 1 ? '' : 'md:!border-none'}>
                    <div className="flex items-center gap-1.5">
                      <span
                        onClick={() => router.push(`/patients/${p.patientNo}`)}
                        className="text-sm font-semibold text-[#0D7377] cursor-pointer"
                      >
                        View
                      </span>
                      <svg
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenMenu(openMenu === p.patientNo ? null : p.patientNo)
                        }}
                        width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0D7377" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className="cursor-pointer shrink-0"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                    {openMenu === p.patientNo && (
                      <div className="absolute right-0 top-6 bg-white border border-[#E2E8F0] rounded-lg shadow-lg min-w-[160px] z-50">
                        <div onClick={() => { router.push(`/patients/${p.patientNo}`); setOpenMenu(null) }} className="py-2.5 px-4 text-sm text-[#1E293B] cursor-pointer border-b border-[#F1F5F9] hover:bg-[#F8FAFC]"
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >Edit Patient</div>
                        <div onClick={() => { window.print(); setOpenMenu(null) }} className="py-2.5 px-4 text-sm text-[#1E293B] cursor-pointer border-b border-[#F1F5F9] hover:bg-[#F8FAFC]"
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >Print Record</div>
                        <div onClick={() => handleDelete(p.patientNo)} className="py-2.5 px-4 text-sm text-[#EF4444] cursor-pointer hover:bg-[#FEF2F2]"
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

      </main>

      {/* Pagination */}
      <div className="px-4 md:px-7 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-auto">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm text-[#475569]">
            {pagination.total > 0 ? `${start}-${end}` : '0'} of {pagination.total} patients
          </span>
          <select
            value={pagination.limit}
            onChange={e => fetchPatients(1, parseInt(e.target.value))}
            className="border border-[#E2E8F0] rounded-md py-1 px-2 text-sm text-[#1E293B] cursor-pointer"
            style={{ colorScheme: 'light' }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <svg
            onClick={() => pagination.page > 1 && fetchPatients(pagination.page - 1)}
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke={pagination.page > 1 ? '#475569' : '#CBD5E1'}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="cursor-pointer"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span className="text-sm text-[#475569]">Page {pagination.page} of {pagination.totalPages}</span>
          <svg
            onClick={() => pagination.page < pagination.totalPages && fetchPatients(pagination.page + 1)}
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke={pagination.page < pagination.totalPages ? '#0D7377' : '#CBD5E1'}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="cursor-pointer"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </>
  )
}
