import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Wallet } from "lucide-react";

export function SectionCards({defaultAccount,totalIncome,totalExpense}) {


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }


  return (
    <div
      className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-3 ">
       <Card className="@container/card">
        <CardHeader>
          <CardDescription>Balance</CardDescription>
          <CardTitle className="text-purple-400 text-2xl font-semibold tabular-num @[250px]/card:text-3xl">
           {formatCurrency(defaultAccount?.balance || 0)}
          </CardTitle>
          <CardAction>
            <div variant="outline" className={"text-purple-600"}>
              <IconTrendingUp size={30}  />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium capitalize">
             { defaultAccount ? defaultAccount?.name : "No Account"}
             <IconTrendingUp className="size-4 text-purple-600"  />
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Income</CardDescription>
          <CardTitle className="text-green-400 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
           {formatCurrency(totalIncome)}
          </CardTitle>
          <CardAction>
            <div variant="outline" className={"text-green-600"}>
            <Wallet size={30}/>
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total Income <IconTrendingUp className="size-4 text-green-600" />
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Expense</CardDescription>
          <CardTitle className="text-red-400 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(totalExpense)}
          </CardTitle>
          <CardAction>
            <div variant="outline" className={"text-red-600"}>
              <Wallet size={30} />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
          Total Expense <IconTrendingDown className="size-4 text-red-600" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
