"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <Card className="max-w-md w-full border-destructive/50">
        <CardHeader className="text-center pb-4">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-2" />
          <CardTitle className="text-2xl font-bold">Something went wrong</CardTitle>
          <CardDescription>
            We encountered a problem loading your dashboard. This might be a database connection issue or unauthorized access.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center flex-col gap-4">
          <div className="bg-muted p-4 rounded-md text-sm font-mono break-words text-muted-foreground overflow-auto">
            {error.message}
          </div>
          <Button onClick={() => reset()} variant="default" className="w-full">
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
