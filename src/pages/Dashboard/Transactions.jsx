import { useAuth } from '@/context/AuthContext'
import { useFetch } from '@/hooks/useFetch'
import { getTransactions } from '@/utils/transaction';
import React, { useEffect } from 'react'

const Transactions = () => {
  const {user} = useAuth();

  const {
    data: transactions,
    isLoading,
    error,    
    fetchData,
  } = useFetch(() => getTransactions(),[user.id])

  useEffect(()=>{
    if (user) {
      fetchData()
    }
  },[user])
  

  console.log(transactions)

  return (
    <div>
      Transactions
    </div>
  )
}

export default Transactions
