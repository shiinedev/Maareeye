import { ArrowUpRight, ArrowDownRight, Trash2Icon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteAccountById, updateDefaultAccount } from "@/lib/account";
import { useState } from "react";
import { Button } from "./ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import toast from "react-hot-toast";


export function AccountCard({ account, fetchAccounts }) {
  const { name, type, balance, id, is_default } = account;

  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

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

  const handleDelete = async (id)=>{
    if (is_default) {
      toast.error("You need at least one default account.");
      return;
    }

    setDeleteLoading(true);
    try {
      await deleteAccountById(id);
      toast.success("Account deleted successfully");
      fetchAccounts();
    } catch (error) {
      console.error("Failed to Delete account:", error);
      toast.error("Failed to delete account. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <>
    <Card className="hover:shadow-md transition-shadow">
      <div>
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

          <div  className="flex justify-between mt-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
            Expense
          </div>
          </div>
        </CardContent>
        <CardFooter className={"mt-2"}>
            <Button variant="destructive" className={"w-full cursor-pointer"} onClick={() => setOpenConfirm(true)} >
            <Trash2Icon /> Delete Account
            </Button> 
        </CardFooter>
      </div>
    </Card>
      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {account.name} Account?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The selected Account will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={deleteLoading}
            onClick={() => setOpenConfirm(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={deleteLoading}
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() => handleDelete(id)}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
   </>
  );
}
