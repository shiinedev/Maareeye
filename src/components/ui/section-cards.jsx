import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BarChart, Wallet } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useFetch } from "@/hooks/useFetch";
import { getDefaultAccountByUserId } from "@/utils/account";
import { getTransactionById, getTransactionsForAccount } from "@/utils/transaction";

export function SectionCards() {

  const {user} = useAuth();

  const {
    data: defaultAccount,
    error: defaultAccountError,
    isLoading: defaultAccountLoading,
    fetchData: refetchDefaultAccount,
  } = useFetch(() => getDefaultAccountByUserId(user?.id), [user?.id]);

  
  const {
    data: accountTransactions,
    error: transactionError,
    isLoading: transactionLoading,
    fetchData: refetchTransaction,
  } = useFetch(() => getTransactionsForAccount(defaultAccount?.id), [user?.id,defaultAccount?.id]);

  console.log(accountTransactions)


 



  return (
    <div
      className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
       <Card className="@container/card">
        <CardHeader>
          <CardDescription>{defaultAccount?.name}</CardDescription>
          <CardTitle className="text-purple-400 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
           ${defaultAccount?.balance.toFixed(2)}
          </CardTitle>
          <CardAction>
            <div variant="outline" className={"text-purple-600"}>
              <IconTrendingUp size={30} />
              
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
             Balance<IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Net Balance</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Income</CardDescription>
          <CardTitle className="text-green-400 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $1,250.00
          </CardTitle>
          <CardAction>
            <div variant="outline" className={"text-green-600"}>
            <Wallet size={30}/>
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Income  month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Income for the last  months
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Expense</CardDescription>
          <CardTitle className="text-red-400 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $ 1,234.00
          </CardTitle>
          <CardAction>
            <div variant="outline" className={"text-red-600"}>
              <Wallet size={30} />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Expense <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Expense for the last  months
          </div>
        </CardFooter>
      </Card>
     
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Top Category</CardDescription>
          <CardTitle className="text-blue-400 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
          <CardAction>
            <div variant="outline" className={"text-blue-600"}>
            <BarChart size={30} />
             
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Top Category <BarChart className="size-4" />
          </div>
          <div className="text-muted-foreground">Top Category For the last Month</div>
        </CardFooter>
      </Card>
    </div>
  );
}
