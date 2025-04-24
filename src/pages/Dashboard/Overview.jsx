import React from 'react'
import { SectionCards } from '@/components/ui/section-cards'
import { BarChar } from '@/components/ui/BarChart'
import { useAuth } from '@/context/AuthContext'
import { useFetch } from '@/hooks/useFetch'
import { getDefaultAccountByUserId } from '@/utils/account'
import { getTransactionsForAccount } from '@/utils/transaction'
import { Spinner } from '@/components/ui/spinner'
import RecentTransactions from './RecentTransactions'
const Overview = () => {

  const {user} = useAuth();
  const {
    data: defaultAccount,
    error: defaultAccountError,
    isLoading: defaultAccountLoading,
  } = useFetch(() => getDefaultAccountByUserId(user?.id), [user?.id]);

  const shouldFetch = !!defaultAccount?.id && !!user?.id;
  const {
    data: accountTransactions,
    error: transactionError,
    isLoading: transactionLoading,
  } = useFetch( 
    shouldFetch ? () => getTransactionsForAccount(defaultAccount?.id,{limit:10}) : null, [user?.id, defaultAccount?.id]);

 // console.log(accountTransactions)

  if (defaultAccountLoading || transactionLoading) {
   return (
         <div className="flex items-center justify-center h-screen gap-3">
           <Spinner className="h-6 w-6 animate-spin- text-purple-500" />
           <div className="loader text-2xl ">
            
             Loading Data Please wait.....
           </div>
         </div>
       );
  }
  return (
     <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards  defaultAccount={defaultAccount} transactions={accountTransactions}/>
              <div className="px-4 lg:px-6">
                <BarChar  transactions={accountTransactions} />
              </div>
              <div>
                <RecentTransactions  transactions={accountTransactions}/>
              </div>
            </div>
          </div>
        </div>
  )
}

export default Overview
