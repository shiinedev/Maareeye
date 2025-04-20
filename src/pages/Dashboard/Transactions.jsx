import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";
import { categoryColors } from "@/data/categories";
import { useFetch } from "@/hooks/useFetch";
import { deleteTransactions, getTransactions } from "@/utils/transaction";
import { format } from "date-fns";
import {
  Badge,
  ChevronDown,
  ChevronUp,
  Clock,
  Loader,
  MoreVertical,
  RefreshCw,
  Search,
  Trash,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleLoading, setDeleteLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });

  const { user } = useAuth();

  const {
    data: transactions,
    isLoading,
    error,
    fetchData,
  } = useFetch(() => getTransactions(), [user.id]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  const filterAndSortTransactions = useMemo(() => {
    let result = transactions || [];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((transaction) =>
        transaction.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    // Apply subscription filter
    if (subscriptionFilter) {
      result = result.filter((transaction) => {
        if (subscriptionFilter === "true") return transaction.is_subscription;
        if (subscriptionFilter === "false") return !transaction.is_subscription;
        return true;
      });
    }
    
     // Apply sorting
     result.sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [searchTerm, typeFilter, subscriptionFilter, transactions,sortConfig]);

  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };


  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setDeleteLoading(true);
    try {
      if (
        !window.confirm(
          `Are you sure you want to delete ${selectedIds.length} transactions?`
        )
      )
        return;
      const deleted = await deleteTransactions(selectedIds);
      console.log(deleted);
      toast.success("Transaction deleted successfully");
      setSelectedIds([]);
      setDeleteLoading(false);
      fetchData();
     
    } catch (error) {
      console.log("error deleting transaction", error);
    } finally {
      setDeleteLoading(false);
      fetchData();
   
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen gap-3">
        <Spinner className="h-6 w-6 animate-spin- text-purple-500" />
        <div className="loader text-2xl ">   Loading Transaction Please wait.....</div>
      </div>
    );
  }

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setSubscriptionFilter("");
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value);
            }}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={subscriptionFilter}
            onValueChange={(value) => {
              setSubscriptionFilter(value);
            }}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Subscription Only</SelectItem>
              <SelectItem value="false">Non-Subscription Only</SelectItem>
            </SelectContent>
          </Select>

          {/* Bulk Actions */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
               onClick={handleBulkDelete}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Selected({selectedIds.length})
              </Button>
            </div>
          )}

          {(searchTerm || typeFilter || subscriptionFilter) && (
            <Button
              variant="destructive"
              size="icon"
              onClick={handleClearFilters}
              title="Clear filters">
              <X className="h-4 w-5" />
            </Button>
          )}
        </div>
      </div>

      <Table className={"border  rounded-md"}>
        <TableCaption>A list of your Transactions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
            <Checkbox
                  checked={
                    selectedIds.length === filterAndSortTransactions.length &&
                    selectedIds.length > 0
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedIds(filterAndSortTransactions.map((tx) => tx.id));
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                />
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("date")}
            >
              <div className="flex items-center">
              Date
              {sortConfig.field === "date" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
              </div>

            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("category")}
              >
            <div className="flex items-center">
                  Category
                  {sortConfig.field === "category" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
               </div>
            </TableHead>
            <TableHead 
            
              className="cursor-pointer"
              onClick={() => handleSort("amount")}
            >
            <div className="flex items-center">
                    Amount
                  {sortConfig.field === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
               </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Subscription</TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterAndSortTransactions?.length > 0 ? (
            filterAndSortTransactions?.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  <Checkbox 
                   checked={selectedIds.includes(transaction.id)}
                   onCheckedChange={(checked) => {
                     setSelectedIds((prev) =>
                       checked
                         ? [...prev, transaction.id]
                         : prev.filter((id) => id !== transaction.id)
                     );
                   }}
                  />
                </TableCell>
                <TableCell>
                  {format(new Date(transaction.date), "PP")}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className={"capitalize"}>
                  
                <span
                      style={{
                        background: categoryColors[transaction.category],
                      }}
                      className="px-2 py-1 rounded text-white text-sm"
                    >
                      {transaction.category}
                    </span>
                  </TableCell>
                <TableCell
                  className={
                    ("text-right font-medium",
                    transaction.type === "expense"
                      ? "text-red-500"
                      : "text-green-500")
                  }>
                  {transaction.type === "expense" ? "-" : "+"} $
                  {parseFloat(transaction.amount).toFixed(2)}
                </TableCell>
                <TableCell>{transaction.status}</TableCell>
                <TableCell>
                  {transaction.is_subscription ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge
                            variant="secondary"
                            className="gap-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200">
                            <RefreshCw className="h-3 w-3" />
                            subscription
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <div className="font-medium">Next Date:</div>
                            <div>{format(new Date(), "PPP")}</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" />
                      One-time
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => selectedIds([transaction.id])}
                        >
                          Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground">
                No transactions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Transactions;
