export default TransactionForm;
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Textarea } from "./ui/textarea";

export function TransactionForm({ className, ...props }) {
  const accounts = [
    {
      id: 1,
      name: "saving",
      balance: 100,
    },
    {
      id: 2,
      name: "currunt",
      balance: 50,
    },
  ];

  const filteredCategories = [
    {
      id: 1,
      name: "food",
    },
    {
      id: 2,
      name: "shopping",
    },
  ];
  return (
    <div className={cn("flex flex-col gap-6 p-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="gradient-title text-2xl font-bold text-center">
            Create New Transaction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3 ">
                <Label className="text-sm font-medium">Type</Label>
                <Select>
                  <SelectTrigger className={"w-full"}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                    <SelectItem value="INCOME">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Amount and Account */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Amount</Label>
                  <Input type="number" step="0.01" placeholder="0.00" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Account</Label>
                  <Select>
                    <SelectTrigger className={"w-full"}>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} ($
                          {parseFloat(account.balance).toFixed(2)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* category and date */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Category</Label>
                  <Select>
                    <SelectTrigger className={"w-full "}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* data */}

                <div className="space-y-2">
                  <Label className="text-sm font-medium mb-2">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          "text-muted-foreground"
                        )}>
                        <span>Pick a date</span>
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Description</Label>
                  <Textarea
                    placeholder="Enter description"
                  />
                  
                </div>
              </div>
              <div className="flex  gap-3">
                <Button variant="outline"  className=" w-full md:w-1/2">
                  Cancel
                </Button>
                <Button variant="purple" type="submit" className="w-full md:w-1/2">
                  Create Transaction
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
