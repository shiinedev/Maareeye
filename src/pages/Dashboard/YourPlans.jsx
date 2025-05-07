import React, { useEffect, useState } from "react";
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
import { useFetch } from "@/hooks/useFetch";
import { deletePlan, getPlansForAccount } from "@/lib/plans";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { getDefaultAccountByUserId } from "@/lib/account";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import PlansSkeleton from "@/components/skeletons/PlansSkeleton";

const statusColor = {
  pending: "bg-yellow-200 text-yellow-800",
  completed: "bg-green-200 text-green-800",
  failed: "bg-red-200 text-red-800",
};

const YourPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const { user } = useAuth();

  const navigate = useNavigate();

  const {
    data: defaultAccount,
    error: defaultAccountError,
    isLoading: defaultAccountLoading,
  } = useFetch(() => getDefaultAccountByUserId(user?.id), [user?.id]);

  // const shouldFetch = !!defaultAccount?.id && !!user?.id;
  const {
    data,
    isLoading: plansLoading,
    error: plansError,
    fetchData,
  } = useFetch( () => getPlansForAccount(defaultAccount?.id),
    [user?.id, defaultAccount?.id]
  );

  useEffect(() => {
    if (defaultAccount?.id) {
      fetchData();
    }
  }, [user.id, defaultAccount?.id, fetchData]);

  const plans = data ?? [];
  console.log(plans);

  // Filter plans by status
  const today = new Date().toISOString().split("T")[0];
  const upcomingPlans = plans?.filter(
    (plan) => plan.status === "pending" && plan.date > today
  );
  const todayPlans = plans?.filter(
    (plan) => plan.status === "pending" && plan.date === today
  );
  const missedPlans = plans?.filter(
    (plan) => plan.status === "pending" && plan.date < today
  );
  const completedPlans = plans?.filter((plan) => plan.status === "completed");
  const failedPlans = plans.filter((plan) => plan.status === "failed");

  const handleDelete = async (id) => {
    if (!id) return;
    setDeleteLoading(true);
    try {
      const deleted = await deletePlan(id);
      console.log(deleted);
      toast.success("plan deleted successfully");
      setSelectedPlan(null);
      fetchData();
    } catch (error) {
      console.log("error deleting plan", error);
    } finally {
      setDeleteLoading(false);
      fetchData();
    }
  };

  if (plansLoading) {
    return (
      <PlansSkeleton />
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Plans</h1>
        <Button
          variant={"purple"}
          onClick={() => navigate("/dashboard/makePlan")}>
          Make New Plan
        </Button>
      </div>

      <Tabs defaultValue="upcoming">
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
              <div className="flex items-center space-x-2">
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
                  </div>

                <div className="flex items-center space-x-2">
                <div className="font-bold">Description:</div>
                <div className="truncate">
                  {selectedPlan.description || "No description"}
                </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="font-bold">Date:</div>
                  <div>
                    {format(new Date(selectedPlan.date), "MMM dd, yyyy")}
                  </div>
                </div>

                {selectedPlan.is_subscription && (
                  <div className="flex flex-col space-y-2">
                    <div className="font-bold">Subscription:</div>
                    <div className="text-base text-muted-foreground">
                      {selectedPlan.subscription_time}
                    </div>
                    <div className="font-bold">Next Date:</div>
                    <div className="text-base text-muted-foreground">
                      {format(new Date(selectedPlan.next_time), "MMM dd, yyyy")}
                    </div>
                  </div>
                )}

                <div className="font-bold">Status:</div>
                <div
                  className={`${
                    statusColor[selectedPlan.status]
                  } py-2 rounded text-base font-medium text-center capitalize`}>
                  {selectedPlan.status}
                </div>
                {selectedPlan.reason && (
                  <div className="flex flex-col space-y-2">
                    <div className="font-bold">Reason:</div>
                    <div className="text-base text-red-500">
                      {selectedPlan.reason}
                    </div>
                  </div>
                )}
              </DialogDescription>
              <div className="flex justify-end space-x-2 mt-4">
                <DialogClose asChild>
                  <Button
                    disabled={deleteLoading}
                    className={"cursor-pointer"}
                    variant={"outline"}
                    size={"xl"}>
                    Close
                  </Button>
                </DialogClose>
                <Button
                  variant={"destructive"}
                  size={"xl"}
                  onClick={() => setOpenConfirm(true)}
                  disabled={deleteLoading}>
                  {deleteLoading ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </Tabs>
      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete plan?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The selected transactions will be
              permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteLoading}
              onClick={() => setOpenConfirm(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteLoading}
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => handleDelete(selectedPlan.id)}>
              {deleteLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default YourPlans;

function PlanGrid({ plans, onViewDetails }) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
