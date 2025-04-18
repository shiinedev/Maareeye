import { AccountCard } from "@/components/AccountCard";
import AccountForm from "@/components/AccountForm";
import { useAuth } from "@/context/AuthContext";
import { useFetch } from "@/hooks/useFetch";
import { getAccountsByUserId } from "@/utils/account";

import React, { useEffect, useState } from "react";

const Accounts = () => {
  const { user } = useAuth();
 
 
  const {
    data:accounts  = [],
    isLoading:accountsLoading,
    error:accountsError,
    fetchData:fetchAccounts
  } = useFetch( () => getAccountsByUserId(user?.id),[user?.id])   
   

  if(accountsLoading){
    <div className='min-h-screen flex justify-center items-center'>
            <div className='animate-spin w-12 h-12 rounded-full border-y-2 border-purple-500'>

            </div>
        </div>
  }

  if (accountsError) {
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load accounts.
      </div>
    );
  }


  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
     <AccountForm fetchAccounts={fetchAccounts} />

    
        {accounts?.length > 0 &&
          accounts?.map((account) => (
            <AccountCard key={account.id} account={account} fetchAccounts={fetchAccounts} />
          ))}
    </div>
  );
};

export default Accounts;
