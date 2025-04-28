import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { accountSchema } from "@/lib/schema";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAccount } from "@/lib/account";
import { Card, CardContent } from "./ui/card";
import { Plus } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import toast from "react-hot-toast";

const AccountForm = ({fetchAccounts}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
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
      is_default: false,
    },
  });

  const onSubmit = async (data) => {
   const formData = {
         user_id:user.id,
         ...data,
       }
      
       try {
         setIsLoading(true);
         if(formData){
        
        const account = await createAccount(formData);
         console.log("account created successfully",account );
         toast.success("Account created successfully")
         fetchAccounts();
         reset();
         setOpen(false);
         }
       } catch (error) {
         console.log("error creating account", error);
         toast.error("Error creating account");
       }finally {
         setIsLoading(false);
       }
      
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full ">
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-sm sm:font-medium">Add New Account</p>
            </CardContent>
          </Card>
          </DialogTrigger>
        <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 ">
        <DialogTitle className="space-y-2">
            <h4 className="font-bold leading-none text-xl text-center gradient-title">
              Create New Account
            </h4>
          </DialogTitle>
          <div className="grid gap-2">
            <div>
              <div className="flex flex-col  gap-3 ">
                <Label htmlFor="width">Name :</Label>
                <Input
                  id="name"
                  {...register("name")}
                  type="text"
                  onChange={(e) => setValue("name", e.target.value)}
                  defaultValue={getValues("name")}
                  placeholder="Enter account name"
                  className="flex-1 w-full h-10"
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div>
            <div className="flex flex-col  gap-3">
              <Label htmlFor="type">Type :</Label>
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
            {/* <div className="flex flex-col  gap-3">
              <Label htmlFor="balance">Balance : </Label>
              <Input
               disabled
                id="balance"
                {...register("balance")}
                step="0.01" 
                value={0} 
                type={"Number"}
              />
             
            </div> */}
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
            <DialogClose>
            <Button
              type="button"
              variant="outline"
              onClick={reset}
              className="w-full">
              Cancel
            </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AccountForm;
