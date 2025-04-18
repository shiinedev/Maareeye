import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { accountSchema } from "@/utils/schema";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAccount } from "@/utils/account";
import { Card, CardContent } from "./ui/card";
import { Plus } from "lucide-react";

const AccountForm = ({fetchAccounts}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [open,setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "current",
      balance: "",
      is_default: false,
    },
  });

  const onSubmit = async (data) => {
   const formData = {
         user_id:user.id,
         ...data,
         balance:parseFloat(data.balance)
       }
      
       try {
         setIsLoading(true);
         if(formData){
        
        const account = await createAccount(formData);
         console.log("account created successfully",account );
         fetchAccounts();
         reset();
         setOpen(false);
         }
       } catch (error) {
         console.log("error creating account", error);
       }finally {
         setIsLoading(false);
       }
      
  };

  return (
    <Popover  open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full ">
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-sm sm:font-medium">Add New Account</p>
            </CardContent>
          </Card>
      </PopoverTrigger>
      <PopoverContent className="mx-2 md:mx-auto max-w-80 " align="start">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none gradient-title">
              Create New Account
            </h4>
          </div>
          <div className="grid gap-2">
            <div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 ">
                <Label htmlFor="width">Name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  type="text"
                  onChange={(e) => setValue("name", e.target.value)}
                  defaultValue={getValues("name")}
                  placeholder="Enter account name"
                  className="flex-1 w-full h-8"
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div>
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <Label htmlFor="type">Type</Label>
              <Select
                {...register("type")}
                onValueChange={(value) => setValue("type", value)}
                defaultValue={getValues("type")}>
                <SelectTrigger className="flex-1 w-full h-8">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="saving">Saving</SelectItem>
                </SelectContent>
              </Select>
              
            </div>
            {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>
            <div>
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <Label htmlFor="balance">Balance</Label>
              <Input
                id="balance"
                {...register("balance")}
                type="Number"
                step="0.01"
                onChange={(e) => setValue("balance", e.target.value)}
                defaultValue={getValues("balance")}
                placeholder="Enter account balance"
                className="flex-1 w-full h-8"
              />
             
            </div>
            {errors.balance && (
                <p className="text-sm text-red-500 ">{errors.balance.message}</p>
              )}
            </div>
            <div className="flex flex-row justify-between mt-2 items-center gap-2">
              <Label htmlFor="isDefault">Set is Default</Label>
              <Switch id="isDefault"     
              checked={watch("is_default")}
              onCheckedChange={(checked) => setValue("is_default", checked)}
               />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Button
              disabled={isLoading}
              type="submit"
              variant="purple"
              className="w-full ">
              Create Account
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={reset}
              className="w-full">
              Cancel
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default AccountForm;
