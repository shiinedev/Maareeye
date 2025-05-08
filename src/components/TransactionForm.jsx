import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema } from "@/lib/schema";
import {
  createTransaction,
  getTransactionById,
  updateTransaction,
} from "@/lib/transaction";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useFetch } from "@/hooks/useFetch";
import { getAccountsByUserId } from "@/lib/account";
import { useNavigate, useParams } from "react-router";
import { ReceiptScanner } from "./ReceiptScanner";
import { toast } from "react-hot-toast";

const TransactionForm = ({ className, categories, ...props }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      amount: 0,
      description: "",
    },
  });

  const {
    data: accounts = [],
    isLoading: accountsLoading,
    error: accountsError,
    fetchData: fetchAccounts,
  } = useFetch(() => getAccountsByUserId(user?.id), [user?.id]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const { id } = useParams();
  const isEdit = Boolean(id);
  const { data: updateData, fetchData: updatedTransaction } = useFetch(
    () => getTransactionById(id),
    [id]
  );

  useEffect(() => {
    if (isEdit && updateData) {
      reset({
        ...updateData,
        amount: String(updateData.amount),
        date: new Date(updateData.date),
      });

      setValue("type", updateData.type);
      setValue("accountId", updateData.accountId);
      setValue("category", updateData.category);
    }
  }, [updateData, reset, isEdit]);

  const handleScanComplete = (scannedData) => {
    if (scannedData) {
      setValue("amount", scannedData.amount.toString());
      setValue("date", new Date(scannedData.date));
      if (scannedData.description) {
        setValue("description", scannedData.description);
      }
      if (scannedData.category) {
        setValue("category", scannedData.category);
      }
     // toast.success("Receipt scanned successfully");
    }
  };

  const onSubmit = async (data) => {

    const formattedDate = format(data.date, "yyyy-MM-dd");

    const formData = {
      user_id: user.id,
      ...data,
      amount: parseFloat(data.amount),
      date: formattedDate,
    };
    console.log(formData);
    setIsLoading(true);
    try {
      if (isEdit) {
        await updateTransaction(id, formData);
        console.log("transaction updated successfully", formData);
        toast.success("Transaction updated successfully");
        reset();
      } else {
        await createTransaction(formData);

        console.log("transaction created successfully", formData);
        toast.success("Transaction created successfully");
        reset();
      }
      navigate("/dashboard/transactionList");
    } catch (error) {
      console.error("Transaction error:", error);
      toast.error( error.message || "Something went wrong please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const type = watch("type");
  const date = watch("date");

  const filteredCategories = categories.filter(
    (category) => category.type === type
  );

  return (
    <div className={cn("flex flex-col gap-6 p-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="gradient-title text-2xl font-bold text-center">
            {isEdit ? "Edit Transaction" : "Create Transaction"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Receipt Scanner */}
            {!isEdit && <ReceiptScanner onScanComplete={handleScanComplete}/>}
            {/* Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Type</Label>
              <Select
                onValueChange={(value) => setValue("type", value)}
                value={type}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            {/* Amount and Account */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("amount")}
                />
                {errors.amount && (
                  <p className="text-sm text-red-500">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Account</Label>
                <Select
                  onValueChange={(value) => setValue("accountId", value)}
                  value={getValues("accountId")}
                  disabled={accountsLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        accountsLoading
                          ? "Loading accounts..."
                          : "Select account"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts?.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} ($
                        {parseFloat(account.balance).toFixed(2)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.accountId && (
                  <p className="text-sm text-red-500">
                    {errors.accountId.message}
                  </p>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Category</Label>
              <Select
                onValueChange={(value) => setValue("category", value)}
                value={getValues("category")}>
                <SelectTrigger className="w-full">
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
              {errors.category && (
                <p className="text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !date && "text-muted-foreground"
                    )}>
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => setValue("date", date)}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Description</Label>
              <Textarea
                placeholder="Enter description"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4">
              <Button
                type="button"
                disabled={isLoading}
                variant="outline"
                onClick={reset}
                className="w-full md:w-1/2">
                Cancel
              </Button>
              <Button
                disabled={isLoading}
                type="submit"
                variant="purple"
                className="w-full md:w-1/2">
                {isLoading
                  ? isEdit
                    ? "updating..."
                    : "creating....."
                  : isEdit
                  ? "Update Transaction"
                  : "Create Transaction"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionForm;
