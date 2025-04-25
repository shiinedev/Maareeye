import { cn } from "@/lib/utils"
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SummaryCards({ filteredTransactions}) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }
 // Calculate summary data
 const income = filteredTransactions?.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

 const expense = filteredTransactions?.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

 const netBalance = income - expense

  return (
    <div className="grid gap-4 md:grid-cols-3 ">
      <Card className={cn("transition-all")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
          <MinusIcon className={cn("h-4 w-4 text-purple-600")} />
        </CardHeader>
        <CardContent>
          <div className={cn("text-2xl font-bold text-purple-600")}>
            {formatCurrency(netBalance > 0 ? netBalance : 0)}
          </div>
        </CardContent>
      </Card>

      <Card >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Income</CardTitle>
          <ArrowUpIcon className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">{formatCurrency(income)}</div>
        </CardContent>
      </Card>

      <Card >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expense</CardTitle>
          <ArrowDownIcon className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">{formatCurrency(expense)}</div>
        </CardContent>
      </Card>
    </div>
  )
}
