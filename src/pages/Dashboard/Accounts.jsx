import { AccountCard } from "@/components/AccountCard";
import AccountForm from "@/components/AccountForm";
import AccountsSkeleton from "@/components/skeletons/AccountsSkeltons";
import { useAuth } from "@/context/AuthContext";
import { useFetch } from "@/hooks/useFetch";
import { getAccountsByUserId } from "@/lib/account";


const Accounts = () => {
  const { user } = useAuth();
 
 
  const {
    data:accounts  = [],
    isLoading:accountsLoading,
    error:accountsError,
    fetchData:fetchAccounts
  } = useFetch( () => getAccountsByUserId(user?.id),[user?.id])   
   

  if(accountsLoading){
   return(
    <AccountsSkeleton />
   )
  }

  if (accountsError) {
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load accounts.
      </div>
    );
  }


  return (
    <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      
    <AccountForm fetchAccounts={fetchAccounts} />

    
        {accounts?.length > 0 &&
          accounts?.map((account) => (
            <AccountCard key={account.id} account={account} fetchAccounts={fetchAccounts} />
          ))}
    </div>
  );
};

export default Accounts;
