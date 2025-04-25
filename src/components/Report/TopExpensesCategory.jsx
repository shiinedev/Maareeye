import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function TopExpensesCategory({ transactions }) {
  // Only consider expense transactions
  const expenseTransactions = transactions.filter((t) => t.type === "expense")

  // Calculate total expenses
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0)

  // Group expenses by category
  const expensesByCategory = {}

  expenseTransactions.forEach((transaction) => {
    if (!expensesByCategory[transaction.category]) {
      expensesByCategory[transaction.category] = {
        amount: 0,
        name: transaction.category,
      }
    }
    expensesByCategory[transaction.category].amount += transaction.amount
  })

  // Convert to array and sort by amount (descending)
  const sortedCategories = Object.entries(expensesByCategory)
    .map(([id, { amount, name }]) => ({ id, amount, name }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5) // Take top 5 categories

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const calculatePercentage = (amount) => {
    return totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {totalExpenses === 0 ? (
          <p className="text-muted-foreground text-center py-4">No expense data available.</p>
        ) : (
          <div className="space-y-4">
            {sortedCategories.map((category) => (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{category.name}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">{calculatePercentage(category.amount)}%</span>
                    <span>{formatCurrency(category.amount)}</span>
                  </div>
                </div>
                <Progress value={calculatePercentage(category.amount)} className="h-2" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
