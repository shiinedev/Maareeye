
import { AppSidebar } from '@/components/ui/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { SiteHeader } from '@/components/ui/site-header'
import React from 'react'
import { Outlet } from 'react-router'

const Dashboard = () => {
  return (
    <SidebarProvider>
    <AppSidebar variant="inset" />
    <SidebarInset>
      <SiteHeader />
      <div className='mt-10'>
      <Outlet />
      </div>
    
    </SidebarInset>
  </SidebarProvider>
  )
}

export default Dashboard
