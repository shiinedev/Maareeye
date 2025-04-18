import { AccountCard } from "@/components/AccountCard";
import AccountForm from "@/components/AccountForm";
import { useAuth } from "@/context/AuthContext";
import { getAccountsByUserId } from "@/utils/account";

import React, { useEffect, useState } from "react";

const Accounts = () => {
  
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);  
   const { user } = useAuth();

   
   useEffect(() => {
    fetchAccounts();
  }, [user,accounts]);


  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      if(!user) return;
      const accounts = await getAccountsByUserId(user.id);
      if (accounts) {
        setAccounts(accounts);
        setIsLoading(false)
      }
      
    } catch (error) {
      console.log("error fetching accounts",error)
    }finally {
      setIsLoading(false);
    }
   
  }
 



  

  if(isLoading){
    <div className='min-h-screen flex justify-center items-center'>
            <div className='animate-spin w-12 h-12 rounded-full border-y-2 border-purple-500'>

            </div>
        </div>
  }
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
     <AccountForm />

    
        {accounts.length > 0 &&
          accounts?.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
    </div>
  );
};

export default Accounts;
