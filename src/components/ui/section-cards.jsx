import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BarChart, Wallet } from "lucide-react";
import { generateReport } from "@/utils/transaction";
import { useMemo } from "react";

export function SectionCards({defaultAccount, transactions}) {

 

  const reportData = useMemo(() => {
    if (!Array.isArray(transactions)) return null;
    return  generateReport(transactions);
  }, [transactions]);
  

 // console.log(reportData);


  return (
    <div
      className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
       <Card className="@container/card">
        <CardHeader>
          <CardDescription>Balance</CardDescription>
          <CardTitle className="text-purple-400 text-2xl font-semibold tabular-num @[250px]/card:text-3xl">
           ${defaultAccount?.balance.toLocaleString("en-Us",
            { minimumFractionDigits:2,},{ maximumFractionDigits:2,})}
          </CardTitle>
          <CardAction>
            <div variant="outline" className={"text-purple-600"}>
              <IconTrendingUp size={30} />
              
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium capitalize">
             { defaultAccount ? defaultAccount?.name : "No Account"}<IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground capitalize">{defaultAccount ? defaultAccount?.type : "no account"}</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Income</CardDescription>
          <CardTitle className="text-green-400 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
           ${reportData?.income?.toLocaleString("en-Us",
            { minimumFractionDigits:2,},{ maximumFractionDigits:2,})}
          </CardTitle>
          <CardAction>
            <div variant="outline" className={"text-green-600"}>
            <Wallet size={30}/>
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Income <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground capitalize">
            Total Income for The Account
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Expense</CardDescription>
          <CardTitle className="text-red-400 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${reportData?.expense?.toLocaleString("en-Us",
            { minimumFractionDigits:2,},{ maximumFractionDigits:2,})}
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
          <div className="text-muted-foreground capitalize">
           Total Expense for the Account
          </div>
        </CardFooter>
      </Card>
     
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Top Expense Category</CardDescription>
          <CardTitle className="text-blue-400 text-2xl font-semibold tabular-num @[250px]/card:text-3xl">
            ${reportData?.topCategory?.amount.toLocaleString("en-Us",
            { minimumFractionDigits:2,},{ maximumFractionDigits:2,}) || "0.00"}
          </CardTitle>
          <CardAction>
            <div variant="outline" className={"text-blue-600"}>
            <BarChart size={30} />
             
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium capitalize">
            {reportData?.topCategory?.category || "No Expense" } <BarChart className="size-4" />
          </div>
          <div className="text-muted-foreground capitalize">Top Expense Category </div>
        </CardFooter>
      </Card>
    </div>
  );
}
