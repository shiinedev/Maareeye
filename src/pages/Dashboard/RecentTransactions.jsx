import { SubscriptionOptions } from "@/components/SubscriptionOptions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

import { categoryColors } from "@/data/categories";

import { cn } from "@/lib/utils";

import { IconCircleCheckFilled } from "@tabler/icons-react";
import { format } from "date-fns";
import {
  HandCoins,
} from "lucide-react";
import React from "react";



const RecentTransactions = ({transactions}) => {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Recent Transactions</h1>
      <Table className={"border  rounded-md"}>
        <TableCaption>A list of your Transactions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>
                Amount
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Subscription</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions?.length > 0 ? (
            transactions?.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {format(new Date(transaction.date), "PP")}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
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
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground">
                No Recent transactions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentTransactions;
