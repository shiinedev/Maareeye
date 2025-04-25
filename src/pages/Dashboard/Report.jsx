
import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { SummaryCards } from "@/components/Report/summaryCard"

// Sample data
import { transactions, accounts, categories, types } from "@/data/data"
import { ReportTransactions } from "@/components/Report/ReportTransactions"
import { TopExpensesCategory } from "@/components/Report/TopExpensesCategory"

export default function Report() {
  // State for filters
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const [selectedType, setSelectedType] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedAccount, setSelectedAccount] = useState("all")

  // Filter transactions based on selections
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date)
    const dateInRange = transactionDate >= dateRange.from && transactionDate <= dateRange.to

    const typeMatch = selectedType === "all" || transaction.type === selectedType
    const categoryMatch = selectedCategory === "all" || transaction.category === selectedCategory
    const accountMatch = selectedAccount === "all" || transaction.account === selectedAccount

    return dateInRange && typeMatch && categoryMatch && accountMatch
  })

  // Calculate summary data
  const income = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const expense = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const netBalance = income - expense

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Financial Report</h1>
        <p className="text-muted-foreground">View and analyze your financial transactions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={(range) => setDateRange(range)}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {/* Type Select */}
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent >
            <SelectItem value="all">All Types</SelectItem>
            {types.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category Select */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Account Select */}
        <Select value={selectedAccount} onValueChange={setSelectedAccount}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Accounts</SelectItem>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <SummaryCards netBalance={netBalance} income={income} expense={expense} />
      {/* Top Expenses category */}
      <Card>
        <CardHeader>
          <CardTitle>Top Expenses Category</CardTitle>
        </CardHeader>
        <CardContent>
          <TopExpensesCategory transactions={filteredTransactions} />
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <ReportTransactions transactions={filteredTransactions} />
        </CardContent>
      </Card>
    </div>
  )
}
