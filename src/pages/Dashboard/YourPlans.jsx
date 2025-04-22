import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

// Example plan data (replace this with actual data from your backend)
const allPlans = [
  {
    id: 1,
    type: "income",
    amount: 250,
    date: "2025-04-25",
    category: "Salary",
    status: "pending",
    description: "April Salary",
  },
  {
    id: 2,
    type: "expense",
    amount: 50,
    date: "2025-04-24",
    category: "Groceries",
    status: "completed",
    description: "Weekly groceries",
  },
  {
    id: 3,
    type: "expense",
    amount: 120,
    date: "2025-03-20",
    category: "Subscription",
    status: "failed",
    description: "Streaming service",
  },
  {
    id: 4,
    type: "expense",
    amount: 120,
    date: "2025-04-22",
    category: "Subscription",
    status: "pending",
    description: "Streaming service",
  },
  {
    id: 5,
    type: "expense",
    amount: 120,
    date: "2025-02-20",
    category: "Subscription",
    status: "failed",
    description: "Streaming service",
  },
  {
    id: 6,
    type: "income",
    amount: 120,
    date: "2025-03-24",
    category: "Subscription",
    status: "completed",
    description: "Streaming service",
  },
  {
    id: 7,
    type: "expense",
    amount: 120,
    date: "2025-05-20",
    category: "Subscription",
    status: "pending",
    description: "Streaming service",
  },
];

const statusColor = {
  pending: "bg-yellow-200 text-yellow-800",
  completed: "bg-green-200 text-green-800",
  failed: "bg-red-200 text-red-800",
};

const YourPlans = () => {
  const [plans] = useState(allPlans);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Filter plans by status
  const today = new Date().toISOString().split("T")[0];
  const upcomingPlans = plans.filter(
    (plan) => plan.status === "pending" && plan.date > today
  );
  const todayPlans = plans.filter(
    (plan) => plan.status === "pending" && plan.date === today
  );
  const missedPlans = plans.filter(
    (plan) => plan.status === "pending" && plan.date < today
  );
  const completedPlans = plans.filter((plan) => plan.status === "completed");
  const failedPlans = plans.filter((plan) => plan.status === "failed");

  return (
    <Tabs defaultValue="upcoming" className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Plans</h1>
      <TabsList className="w-full mb-4">
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="today">Today</TabsTrigger>
        <TabsTrigger value="missed">Missed</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
        <TabsTrigger value="failed">Failed</TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming">
        <PlanGrid plans={upcomingPlans} onViewDetails={setSelectedPlan} />
      </TabsContent>
      <TabsContent value="today">
        <PlanGrid plans={todayPlans} onViewDetails={setSelectedPlan} />
      </TabsContent>
      <TabsContent value="missed">
        <PlanGrid plans={missedPlans} onViewDetails={setSelectedPlan} />
      </TabsContent>
      <TabsContent value="completed">
        <PlanGrid plans={completedPlans} onViewDetails={setSelectedPlan} />
      </TabsContent>
      <TabsContent value="failed">
        <PlanGrid plans={failedPlans} onViewDetails={setSelectedPlan} />
      </TabsContent>

      {/* Modal for viewing detailed plan */}
      {selectedPlan && (
        <Dialog open={true} onOpenChange={() => setSelectedPlan(null)}>
          <DialogContent className="p-6">
            <DialogTitle>{selectedPlan.category}</DialogTitle>
            <DialogDescription className="space-y-4">
              <div className="font-bold">Amount:</div>
              <div
                className={`${
                  selectedPlan.type === "income"
                    ? "text-green-600 text-base font-medium"
                    : "text-red-600 text-base font-medium"
                }`}>
                {selectedPlan.type === "income" ? "+" : "-"}$
                {selectedPlan.amount.toLocaleString(
                  "en-Us",
                  { minimumFractionDigits: 2 },
                  { maximumFractionDigits: 2 }
                )}
              </div>

              <div className="font-bold">Description:</div>
              <div>{selectedPlan.description || "No description"}</div>

              <div className="font-bold">Date:</div>
              <div>{format(new Date(selectedPlan.date), "MMM dd, yyyy")}</div>

              <div className="font-bold">Status:</div>
              <div
                className={`${
                  statusColor[selectedPlan.status]
                } py-2 rounded text-center capitalize`}>
                {selectedPlan.status}
              </div>
            </DialogDescription>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant={"purple"} size={"xl"}>
                Edit
              </Button>
              <DialogClose asChild>
                <Button
                  className={"cursor-pointer"}
                  variant={"destructive"}
                  size={"xl"}>
                  Close
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Tabs>
  );
};

export default YourPlans;

function PlanGrid({ plans, onViewDetails }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 ">
      {plans.length > 0 ? (
        plans.map((plan) => (
          <Card key={plan.id} className="rounded-2xl shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{plan.category}</CardTitle>
              <Badge className={statusColor[plan.status]}>{plan.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">
                {plan.description || "No description"}
              </div>
              <div className="flex justify-between text-sm">
                <span>{format(new Date(plan.date), "MMM dd, yyyy")}</span>
                <span
                  className={`font-medium ${
                    plan.type === "income"
                      ? "text-green-600 text-base font-medium"
                      : "text-red-600 text-base font-medium"
                  }`}>
                  {plan.type === "income" ? "+" : "-"}$
                  {plan.amount.toLocaleString(
                    "en-Us",
                    { minimumFractionDigits: 2 },
                    { maximumFractionDigits: 2 }
                  )}
                </span>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="purple"
                    className="w-full text-sm"
                    onClick={() => onViewDetails(plan)}>
                    View Details
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center mt-10 text-gray-500">
          No plans available in this category.
        </div>
      )}
    </div>
  );
}
