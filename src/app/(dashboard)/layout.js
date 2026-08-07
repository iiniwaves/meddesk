'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import { SidebarProvider, useSidebar } from './sidebar-context'

function DashboardInner({ children }) {
  const { status } = useSession()
  const router = useRouter()
  const { open, close } = useSidebar()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#475569', fontSize: 14 }}>Loading...</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'Inter, -apple-system, sans-serif' }}>
      <Sidebar isOpen={open} onClose={close} />
      {/* ml-0 on mobile, ml-[216px] on desktop to offset fixed sidebar */}
      <div className="flex-1 flex flex-col min-h-screen ml-0 md:ml-[216px]">
        {children}
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <DashboardInner>{children}</DashboardInner>
    </SidebarProvider>
  )
}
