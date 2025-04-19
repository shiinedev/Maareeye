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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";
import { useFetch } from "@/hooks/useFetch";
import { getTransactions } from "@/utils/transaction";
import { format } from "date-fns";
import { Badge, Clock, MoreVertical, RefreshCw, Search, Trash, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";


const Transactions = () => {
  const[searchTerm,setSearchTerm] = useState("");
  const[typeFilter,setTypeFilter] = useState("");
  const[subscriptionFilter,setSubscriptionFilter] = useState("");
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
  }, [user]);


  // filteredTransactions 
  const filteredTransactions = useMemo( () => {
    let result = [...(transactions || [])]; ;

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

    //Apply by subscription filter
    if (subscriptionFilter) {
      result = result.filter((transaction) => {
        if (subscriptionFilter === "true") return transaction.is_subscription;
        if (subscriptionFilter === "false") return !transaction.is_subscription;
        return true;
      });
    }

    return result;
},[searchTerm, typeFilter, subscriptionFilter, transactions]);


  if (isLoading) { 
    return (  
      <div className="flex items-center justify-center h-screen">
        <div className="loader">Loading</div>
      </div>
    );
  }


  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setSubscriptionFilter("");
  } 
   
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 bg-red-100 p-4 rounded-md shadow-sm border border-red-200">
          <p className="font-semibold">Failed to load transactions.</p>
          <p className="text-sm">Please try again later.</p>
        </div>
      </div>
    );
  }
   
  
      
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
             
            }}
          >
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
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Subscription Only</SelectItem>
              <SelectItem value="false">Non-Subscription Only</SelectItem>
            </SelectContent>
          </Select>

        
          {(searchTerm || typeFilter || subscriptionFilter) && (
            <Button
              variant="destructive"
              size="icon"
              onClick={handleClearFilters}
              title="Clear filters"
            >
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
              <Checkbox />
            </TableHead>
            <TableHead>date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Subscription</TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
         
            {
              filteredTransactions?.length > 0 ? (
                filteredTransactions?.map((transaction) => (
              <TableRow key={transaction.id}>
            <TableCell className="font-medium">
              <Checkbox />
            </TableCell>
            <TableCell> {format(new Date(transaction.date), "PP")}</TableCell>
            <TableCell>{transaction.description}</TableCell>
            <TableCell>{transaction.category}</TableCell>
            <TableCell 
             className={(
              "text-right font-medium",
              transaction.type === "expense"
                ? "text-red-500"
                : "text-green-500"
            )}>
              { transaction.type === "expense" ? "-": "+"} ${parseFloat(transaction.amount).toFixed(2)}</TableCell>
            <TableCell>{transaction.status}</TableCell>
            <TableCell>
              {
                transaction.is_subscription ?(
                  <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant="secondary"
                              className="gap-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"
                            >
                              <RefreshCw className="h-3 w-3" />
                             subscription
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <div className="font-medium">Next Date:</div>
                              <div>
                                {format(
                                  new Date(),
                                  "PPP"
                                )}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
             </TooltipProvider> 
                )
                :
                <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                One-time
              </Badge>
              }
            
              
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
                  // onClick={() =>
                  //   router.push(
                  //     `/transaction/create?edit=${transaction.id}`
                  //   )
                  // }
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    // onClick={() => deleteFn([transaction.id])}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
            </TableRow>
        ))
      ):(
        <TableRow>
        <TableCell
          colSpan={7}
          className="text-center text-muted-foreground"
        >
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
