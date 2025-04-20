import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { CalendarDays, Repeat, CalendarCheck2, CalendarHeart } from "lucide-react";

const subscriptionOptions = [
  {
    value: "daily",
    label: "Daily",
    icon: <CalendarDays className="h-3 w-3 text-blue-500" />,
    bg: "bg-blue-100",
    text: "text-blue-800",
  },
  {
    value: "weekly",
    label: "Weekly",
    icon: <Repeat className="h-3 w-3 text-green-500" />,
    bg: "bg-green-100",
    text: "text-green-800",
  },
  {
    value: "monthly",
    label: "Monthly",
    icon: <CalendarCheck2 className="h-3 w-3 text-yellow-500" />,
    bg: "bg-yellow-100",
    text: "text-yellow-800",
  },
  {
    value: "yearly",
    label: "Yearly",
    icon: <CalendarHeart className="h-3 w-3 text-purple-500" />,
    bg: "bg-purple-100",
    text: "text-purple-800",
  },
];

export function SubscriptionOptions({ selected }) {
    console.log(selected)
  return (
    <div className="w-full flex items-center justify-between">
      {subscriptionOptions.map((option) => (
          selected === option.value &&(
        <Card
          key={option.value}
          className={cn(
            ` ${option.bg} ${option.text} flex cursor-pointer px-2 py-1  rounded border transition-all duration-200`, )}
        >
            <span className="flex items-center gap-2 text-sm font-medium">
            {option.icon}
        
        {option.label}
                
         </span> 
      
        
        </Card>
      )))
      }
    </div>
  );
}
