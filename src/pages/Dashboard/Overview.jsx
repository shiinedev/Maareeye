import React from 'react'
import data  from '../../data/data.json'
import { SectionCards } from '@/components/ui/section-cards'
import { BarChar } from '@/components/ui/BarChart'
import { DataTable } from '@/components/ui/data-table'
const Overview = () => {
  return (
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
  )
}

export default Overview
