import React from 'react'
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

const AccountForm = () => {
  return (
       <Popover >
        <PopoverTrigger className="py-10" asChild>
          <Button variant="outline">Add New Account</Button>
        </PopoverTrigger>
        <PopoverContent className="mx-2 md:mx-auto max-w-80 " align="start">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none gradient-title">
                Create New Account
              </h4>
            </div>
            <div className="grid gap-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2 ">
                <Label htmlFor="width">name</Label>
                <Input
                  id="name"
                  placeholder="Enter account name"
                  className="flex-1 w-full h-8"
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <Label htmlFor="type">type</Label>
                <Select>
                  <SelectTrigger className="flex-1 w-full h-8">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current</SelectItem>
                    <SelectItem value="saving">Saving</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <Label htmlFor="balance">balance</Label>
                <Input
                  id="balance"
                  placeholder="Enter account balance"
                  className="flex-1 w-full h-8"
                />
              </div>
              <div className="flex flex-row justify-between mt-2 items-center gap-2">
                <Label htmlFor="isDefault">Is Default</Label>
                <Switch id="isDefault" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Button
                // disabled={isLoading}
                type="submit"
                variant="purple"
                className="w-full ">
                Create Account
              </Button>
              <Button
                type="button"
                variant="outline"
                // onClick={reset}
                className="w-full">
                Cancel
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

  )
}

export default AccountForm
