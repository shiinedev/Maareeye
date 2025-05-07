
import { Skeleton } from "@/components/ui/skeleton";

const AccountsSkeleton = () => {
  const cardCount = 3; // Number of skeleton cards to simulate

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {/* AccountForm skeleton */}
      <div className="border rounded-xl p-4 space-y-3 shadow">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-1/2 rounded-md" />
      </div>

      {/* Account cards skeletons */}
      {Array.from({ length: cardCount }).map((_, i) => (
        <div
          key={i}
          className="border rounded-xl p-4 space-y-4 shadow-md flex flex-col justify-between"
        >
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-8 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
};

export default AccountsSkeleton;
