'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { SidebarProvider, useSidebar } from './providers/SidebarProvider'
import Sidebar from '@/components/Sidebar'

function DashboardInnerLayout({ children }) {
  const { status } = useSession()
  const router = useRouter()
  const sidebar = useSidebar()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center">
        <p className="text-sm text-[#475569]">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
      {/* Desktop sidebar — controlled by layout */}
      <Sidebar isOpen={sidebar.open} onClose={sidebar.close} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-0 md:ml-[216px]">
        {children}
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <DashboardInnerLayout>{children}</DashboardInnerLayout>
    </SidebarProvider>
  )
}
