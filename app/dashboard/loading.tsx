"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
      <div className="space-y-3">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
        
        <Card className="col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-11/12" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </CardContent>
      </Card>
    </div>
  );
}
