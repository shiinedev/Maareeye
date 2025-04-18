import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateDefaultAccount } from "@/utils/account";
import { toast } from "sonner";
import { useState } from "react";


export function AccountCard({ account,fetchAccounts }) {
  const { name, type, balance, id, is_default } = account;

  const [isLoading,setIsLoading] = useState(false);

  const handleToggleDefault = async (id) => {
    if (is_default) {
      toast.warning("You need at least one default account.");
      return;
    }

    setIsLoading(true);
    try {
      await updateDefaultAccount(id);
      fetchAccounts();
    } catch (error) {
      console.error("Failed to update default account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow group relative">
      <div >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium capitalize">
            {name}
          </CardTitle>
          <Switch
          checked={is_default}
          onCheckedChange={() => handleToggleDefault(id)}
          disabled={isLoading}
          />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
            Expense
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}