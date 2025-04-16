import React from 'react'

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/ui/app-sidebar'
import { SiteHeader } from '@/components/ui/site-header'
import { SectionCards } from '@/components/ui/section-cards'
import { BarChar } from '@/components/ui/BarChart'
import { DataTable } from '@/components/ui/data-table'
import data  from './data.json'
const Dashboard = () => {
  return (
    <div>
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <BarChar />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </div>
  )
}

export default Dashboard
