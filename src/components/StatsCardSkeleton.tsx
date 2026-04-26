import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsCardSkeleton() {
  return (
    <Card className="w-full md:w-auto md:flex-1 md:min-w-56 md:max-w-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-20 h-5 rounded" />
          </div>
          <Skeleton className="w-10 h-4 rounded" />
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        <div>
          <Skeleton className="w-20 h-3 mb-1" />
          <div className="grid grid-cols-3 gap-1 sm:gap-2">
            <div className="bg-gray-50 rounded-lg p-1.5 sm:p-2 space-y-1">
              <Skeleton className="w-8 h-6 mx-auto rounded" />
              <Skeleton className="w-10 h-3 mx-auto rounded" />
            </div>
            <div className="bg-gray-50 rounded-lg p-1.5 sm:p-2 space-y-1">
              <Skeleton className="w-8 h-6 mx-auto rounded" />
              <Skeleton className="w-10 h-3 mx-auto rounded" />
            </div>
            <div className="bg-gray-50 rounded-lg p-1.5 sm:p-2 space-y-1">
              <Skeleton className="w-8 h-6 mx-auto rounded" />
              <Skeleton className="w-10 h-3 mx-auto rounded" />
            </div>
          </div>
        </div>
        <div>
          <Skeleton className="w-32 h-3 mb-1" />
          <div className="grid grid-cols-3 gap-1 sm:gap-2">
            <div className="bg-gray-100 rounded-lg p-1.5 sm:p-2 space-y-1">
              <Skeleton className="w-8 h-6 mx-auto rounded" />
              <Skeleton className="w-10 h-3 mx-auto rounded" />
            </div>
            <div className="bg-gray-100 rounded-lg p-1.5 sm:p-2 space-y-1">
              <Skeleton className="w-8 h-6 mx-auto rounded" />
              <Skeleton className="w-10 h-3 mx-auto rounded" />
            </div>
            <div className="bg-gray-100 rounded-lg p-1.5 sm:p-2 space-y-1">
              <Skeleton className="w-8 h-6 mx-auto rounded" />
              <Skeleton className="w-10 h-3 mx-auto rounded" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
