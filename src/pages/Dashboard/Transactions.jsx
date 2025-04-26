import { SubscriptionOptions } from "@/components/SubscriptionOptions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
import { getDefaultAccountByUserId } from "@/utils/account";
import {
  deleteTransactions,
  getTransactionsForAccountWithPagination,
} from "@/utils/transaction";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  HandCoins,
  MoreVertical,
  Search,
  Trash,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const navigate = useNavigate();

  const { user } = useAuth();
  const {
    data: defaultAccount,
    error: defaultAccountError,
    isLoading: defaultAccountLoading,
  } = useFetch(() => getDefaultAccountByUserId(user?.id), [user?.id]);

  const shouldFetch = !!defaultAccount?.id && !!user?.id;

  const {
    data: transactionData,
    isLoading,
    error,
    fetchData,
  } = useFetch(
    shouldFetch
      ? () =>
          getTransactionsForAccountWithPagination(defaultAccount?.id, {
            limit: itemsPerPage,
            offset: (currentPage - 1) * itemsPerPage,
          })
      : null,
    [user.id, defaultAccount?.id, currentPage, itemsPerPage]
  );

  const transactions = transactionData?.data || [];
  const totalCount = transactionData?.count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user.id, defaultAccount?.id, fetchData]);

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
  }, [searchTerm, typeFilter, subscriptionFilter, transactions, sortConfig]);

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
      const deleted = await deleteTransactions(selectedIds);
      console.log(deleted);
      toast.success("Transaction deleted successfully");
      setSelectedIds([]);
      setDeleteLoading(false);
      fetchData();
    } catch (error) {
      console.log("error deleting transaction", error);
      toast.error("Failed to delete transactions. Please try again.");
    } finally {
      setDeleteLoading(false);
      fetchData();
    }
  };

  // const handleDelete = async (id) => {
  //   if (!id) return;
  //   setDeleteLoading(true);
  //   try {
  //     if (
  //       !window.confirm(
  //         `Are you sure you want to delete ${selectedIds.length} transactions?`
  //       )
  //     )
  //       return;
  //     const deleted = await deleteTransactions(id);
  //     console.log(deleted);
  //     toast.success("Transaction deleted successfully");
  //     setSelectedIds([]);
  //     setDeleteLoading(false);
  //     fetchData();
  //   } catch (error) {
  //     console.log("error deleting transaction", error);
  //   } finally {
  //     setDeleteLoading(false);
  //     fetchData();
  //   }
  // };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen gap-3">
        <Spinner className="h-6 w-6 animate-spin- text-purple-500" />
        <div className="loader text-2xl ">
          {" "}
          Loading Transaction Please wait.....
        </div>
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Button
          variant={"purple"}
          onClick={() => navigate("/dashboard/addTransaction")}>
          Add New Transaction
        </Button>
      </div>

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
                onClick={() => setOpenConfirm(true)}
                disabled={deleteLoading}>
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
                    setSelectedIds(
                      filterAndSortTransactions.map((tx) => tx.id)
                    );
                  } else {
                    setSelectedIds([]);
                  }
                }}
              />
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("date")}>
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
              onClick={() => handleSort("category")}>
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
              onClick={() => handleSort("amount")}>
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
                <TableCell>
                  {transaction.description.length > 10
                    ? `${transaction.description.substring(0, 30)}...`
                    : transaction.description}
                </TableCell>
                <TableCell className={"capitalize"}>
                  <span
                    style={{
                      background: categoryColors[transaction.category],
                    }}
                    className="px-2 py-1 rounded text-white text-sm">
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
                  {parseFloat(transaction.amount).toLocaleString("en-US")}
                </TableCell>
                <TableCell>
                  <Button variant="outline" className="capitalize rounded-full">
                    <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
                    {transaction.status}
                  </Button>
                </TableCell>
                <TableCell>
                  {transaction.is_subscription ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <SubscriptionOptions
                            selected={transaction.subscription_time}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <div className="font-medium">Next Date:</div>
                            <div>
                              {format(new Date(transaction.next_time), "PPP")}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <Card
                      className={cn(
                        ` max-w-25 bg-gray-100 text-gray-800  px-2 py-1  rounded border transition-all duration-200`
                      )}>
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <HandCoins className="h-3 w-3 text-gray-500" />
                        One Time
                      </span>
                    </Card>
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
                        onClick={() =>
                          navigate(
                            `/dashboard/addTransaction/${transaction.id}`
                          )
                        }>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setSelectedIds([transaction.id])}>
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
      <div className="flex items-center gap-2">
        <label htmlFor="perPage" className="text-sm">
          Items per page:
        </label>
        <Select
          value={String(itemsPerPage)}
          onValueChange={(val) => {
            setItemsPerPage(Number(val));
            setCurrentPage(1); // Reset to first page
          }}>
          <SelectTrigger className="w-[80px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between mt-4">
        <Button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}>
          Previous
        </Button>
        <div className="text-sm">
          Page {currentPage} of {totalPages || 1}
        </div>
        <Button
          onClick={() => setCurrentPage((p) => (p < totalPages ? p + 1 : p))}
          disabled={currentPage >= totalPages}>
          Next
        </Button>
      </div>
      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {selectedIds.length} Account?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The selected transactions will be
              permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteLoading}
              onClick={() => setOpenConfirm(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteLoading}
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => handleBulkDelete()}>
              {deleteLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Transactions;
