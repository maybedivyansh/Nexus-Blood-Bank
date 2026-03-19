"use client";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { Check } from "lucide-react";

export function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} variant="outline" className="border-green-500/20 text-green-600 hover:bg-green-500 hover:text-white shadow-sm gap-2">
      <Check className="w-4 h-4" />
      {pending ? "Registering & Sycning..." : "Confirm Arrival"}
    </Button>
  );
}
