

import { Skeleton } from "@/components/ui/skeleton";

const rows = Array.from({ length: 10 }); // Adjust based on how many rows to show

const TransactionSkeleton = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Header + Button */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-32" />
        <Skeleton  className="h-8 w-36 bg-purple-400" />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>

      {/* Table Headers */}
      <div className="w-full border rounded-md overflow-hidden">
        <div className="grid grid-cols-6 bg-muted px-4 py-2 font-medium text-sm">
          <Skeleton className="h-4 w-4 col-span-1" />
          <Skeleton className="h-4 w-24 col-span-1" />
          <Skeleton className="h-4 w-24 col-span-1" />
          <Skeleton className="h-4 w-24 col-span-1" />
          <Skeleton className="h-4 w-24 col-span-1" />
          <Skeleton className="h-4 w-16 col-span-1" />
        </div>

        {/* Table Rows */}
        {rows.map((_, i) => (
          <div key={i} className="grid grid-cols-6 items-center border-t px-4 py-3">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-40" />
      </div>
    </div>
  );
};

export default TransactionSkeleton;
