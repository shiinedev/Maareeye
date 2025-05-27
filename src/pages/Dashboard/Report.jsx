import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils.js";
import { SummaryCards } from "@/components/Report/summaryCard";
import { ReportTransactions } from "@/components/Report/ReportTransactions";
import { TopExpensesCategory } from "@/components/Report/TopExpensesCategory";
import { useAuth } from "@/context/AuthContext";
import { useFetch } from "@/hooks/useFetch";
import {
  getAccountsByUserId,
  getDefaultAccountByUserId,
} from "@/lib/account.js";
import { defaultCategories } from "../../data/categories.js";
import { getTransactionsForAccount } from "@/lib/transaction.js";
import { Spinner } from "@/components/ui/spinner.jsx";
import { useNavigate } from "react-router";
import { ReportSkeleton } from "@/components/skeletons/ReportSkelton.jsx";

export const types = [
  { id: "income", name: "Income" },
  { id: "expense", name: "Expense" },
];

export default function Report() {
  // State for filters
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [selectedType, setSelectedType] = useState("expense");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAccount, setSelectedAccount] = useState(null);

  const navigate = useNavigate();

  const { user } = useAuth();
  const {
    data: defaultAccount,
    error: defaultAccountError,
    isLoading: defaultAccountLoading,
  } = useFetch(() => getDefaultAccountByUserId(user?.id), [user?.id]);
  console.log(defaultAccount);

  // 👇 Set selected account once default account is available
  useEffect(() => {
    if (defaultAccount && !selectedAccount) {
      setSelectedAccount(defaultAccount.id);
    }
  }, [defaultAccount, selectedAccount]);

  const {
    data: accounts = [],
    isLoading: accountsLoading,
    error: accountsError,
    fetchData: fetchAccounts,
  } = useFetch(() => getAccountsByUserId(user?.id), [user?.id]);

  const {
    data: transactions = [],
    isLoading: transactionLoading,
    error: transactionError,
    fetchData: transactionFetch,
  } = useFetch(
    () => getTransactionsForAccount(selectedAccount),
    [selectedAccount, user?.id]
  );

  console.log(transactions);

  // Filter transactions based on selections
  const filteredTransactions = transactions?.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const dateInRange =
      transactionDate >= dateRange.from && transactionDate <= dateRange.to;

    const typeMatch = transaction.type === selectedType;
    const categoryMatch =
      selectedCategory === "all" || transaction.category === selectedCategory;
    const accountMatch = transaction.accountId === selectedAccount;

    return dateInRange && typeMatch && categoryMatch && accountMatch;
  });

  const filteredCategories = defaultCategories.filter(
    (category) => category.type === selectedType
  );

  if (defaultAccountLoading || transactionLoading) {
    return <ReportSkeleton />;
  }
  if (!defaultAccount) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <h2 className="text-xl font-semibold">No account found</h2>
        <p className="text-muted-foreground">
          Please create an account to start tracking your Report.
        </p>
        <Button
          variant={"purple"}
          onClick={() => navigate("/dashboard/accounts")}>
          Go to Accounts
        </Button>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Financial Report</h1>
        <p className="text-muted-foreground">
          View and analyze your financial transactions
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
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
          <SelectContent>
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
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Account Select */}
        <Select value={selectedAccount} onValueChange={setSelectedAccount}>
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                accountsLoading ? "Loading accounts..." : "Select account"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {accounts?.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <SummaryCards filteredTransactions={filteredTransactions} />
      {/* Top Expenses category */}
      <Card>
        <CardHeader>
          <CardTitle>Top Expenses Category</CardTitle>
        </CardHeader>
        <CardContent>
          <TopExpensesCategory filteredTransactions={filteredTransactions} />
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <ReportTransactions filteredTransactions={filteredTransactions} />
        </CardContent>
      </Card>
    </div>
  );
}
