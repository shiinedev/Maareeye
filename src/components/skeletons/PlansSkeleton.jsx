
import { Skeleton } from "@/components/ui/skeleton";

const PlansSkeleton = () => {
  const cardCount = 3; // Number of skeleton cards to show

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-32 bg-purple-600" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 ">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md bg-purple-400" />
        ))}
      </div>

      {/* Card Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cardCount }).map((_, i) => (
          <div key={i} className="rounded-2xl border shadow-md p-4 space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-8 w-full rounded-md bg-purple-500" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlansSkeleton;
