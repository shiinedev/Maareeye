import React from 'react'
import {defaultCategories}  from '../../data/categories.js'
import PlanForm from '@/components/PlanForm.jsx'
const MakePlan = () => {
  return (
    <div>
      <PlanForm  categories={defaultCategories} />
    </div>
  )
}

export default MakePlan
