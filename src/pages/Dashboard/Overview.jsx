import * as React from "react"
import { SectionCards } from '@/components/ui/section-cards'
import { BarChar } from '@/components/ui/BarChart'
import { useAuth } from '@/context/AuthContext'
import { useFetch } from '@/hooks/useFetch'
import { getDefaultAccountByUserId } from '@/lib/account'
import { getSummaryData, getTransactionsForAccount } from '@/lib/transaction'
import RecentTransactions from './RecentTransactions'
import { OverviewSkeleton } from "@/components/skeletons/OverviewSkeleton"
import { Button } from "@/components/ui/button"
const Overview = () => {
  const [chartData, setChartData ]= React.useState([]);
  const [chartLoading, setChartLoading] =React.useState(true);

  const [totalIncome, setTotalIncome] = React.useState(0);
  const [totalExpense, setTotalExpense] = React.useState(0);
  const {user} = useAuth();
  const {
    data: defaultAccount,
    error: defaultAccountError,
    isLoading: defaultAccountLoading,
  } = useFetch(() => getDefaultAccountByUserId(user?.id), [user?.id]);

  // const shouldFetch = !!defaultAccount?.id && !!user?.id;
  const {
    data: accountTransactions,
    error: transactionError,
    isLoading: transactionLoading,
  } = useFetch(  () => getTransactionsForAccount(defaultAccount?.id), [user?.id, defaultAccount?.id]);

 // console.log(accountTransactions)

 React.useEffect(() => {
   if (!Array.isArray(accountTransactions)) return;
 
   const fetchChart = async () => {
     try {
       setChartLoading(true);
       const {chartData:result,totalIncome,totalExpense} = await getSummaryData(accountTransactions);
        //console.log(totalIncome)
       console.log(chartData)
       setChartData(result);
       setTotalIncome(totalIncome);
       setTotalExpense(totalExpense);
     } catch (err) {
       console.error("Error generating chart:", err);
     } finally {
       setChartLoading(false);
     }
   };
 
   fetchChart();
 }, [accountTransactions]);



  if (defaultAccountLoading ) {
   return (
         <OverviewSkeleton />
       );
  }
   if (!defaultAccount) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
          <h2 className="text-xl font-semibold">No account found</h2>
          <p className="text-muted-foreground">
            Please create an account to start tracking your Dashboard.
          </p>
          <Button variant={"purple"} onClick={() => navigate("/dashboard/accounts")}>
            Go to Accounts
          </Button>
        </div>
      );
    }

    if(transactionLoading){
      return (
        <OverviewSkeleton />
      );
    }

  if (transactionError ) {
    return (
          <div className="flex items-center justify-center h-screen gap-3">
            <div className="loader text-2xl text-red-500 ">
              Error fetching data pleas try again
            </div>
          </div>
        );
   }
  
  return (
     <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-8 md:gap-6">
              <SectionCards  defaultAccount={defaultAccount} totalIncome={totalIncome} totalExpense={totalExpense}/>
              <div className="px-4 lg:px-6">
                <BarChar  chartData={chartData} chartLoading={chartLoading} />
              </div>
              <div>
                <RecentTransactions defaultAccount={defaultAccount} />
              </div>
            </div>
          </div>
        </div>
  )
}

export default Overview
