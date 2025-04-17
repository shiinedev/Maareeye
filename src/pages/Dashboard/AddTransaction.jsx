import TransactionForm from '@/components/TransactionForm'
import React from 'react'
import {defaultCategories}  from '../../data/categories.js'
const AddTransaction = () => {
  console.log(defaultCategories);
  return (
    <div>
    <TransactionForm categories={defaultCategories} />
    </div>
  )
}

export default AddTransaction
