import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Badge, Clock, MoreVertical, RefreshCw } from "lucide-react";
import React, { useEffect } from "react";

const Transactions = () => {
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

  

  return (
    <div className="p-6">
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
            transactions?.map((transaction) => (
              <TableRow>
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
                              className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200"
                            >
                              <RefreshCw className="h-3 w-3" />
                             one time
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
        ))}
         
        </TableBody>
      </Table>
    </div>
  );
};

export default Transactions;
