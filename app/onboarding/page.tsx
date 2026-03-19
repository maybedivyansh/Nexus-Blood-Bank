"use client";

import { useState } from "react";
import { completeOnboarding } from "@/lib/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, HeartPulse, ShieldCheck, Droplet } from "lucide-react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full font-bold shadow-md h-12" disabled={pending}>
      {pending ? "Configuring Account..." : "Continue to Dashboard"}
    </Button>
  );
}

export default function OnboardingPage() {
  const [role, setRole] = useState<"DONOR" | "HOSPITAL" | "BANK">("DONOR");

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-lg shadow-xl border-primary/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="text-center pb-8 pt-6">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Droplet className="w-6 h-6 text-primary fill-primary/20" />
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight">Join NexusBlood</CardTitle>
          <CardDescription className="text-base mt-2">
            Choose your account type to proceed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={completeOnboarding} className="space-y-6">
            <input type="hidden" name="role" value={role} />
            
            <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center gap-4 ${role === "DONOR" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`} onClick={() => setRole("DONOR")}>
              <div className="p-3 bg-primary/10 text-primary rounded-lg"><HeartPulse /></div>
              <div>
                <h3 className="font-bold text-lg">Individual Donor</h3>
                <p className="text-sm text-muted-foreground">Donate blood and track your impact.</p>
              </div>
            </div>

            <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center gap-4 ${role === "HOSPITAL" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`} onClick={() => setRole("HOSPITAL")}>
              <div className="p-3 bg-primary/10 text-primary rounded-lg"><Building2 /></div>
              <div>
                <h3 className="font-bold text-lg">Hospital</h3>
                <p className="text-sm text-muted-foreground">Request emergency blood stocks.</p>
              </div>
            </div>

            <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center gap-4 ${role === "BANK" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`} onClick={() => setRole("BANK")}>
              <div className="p-3 bg-primary/10 text-primary rounded-lg"><ShieldCheck /></div>
              <div>
                <h3 className="font-bold text-lg">Blood Bank</h3>
                <p className="text-sm text-muted-foreground">Manage inventory and fulfill orders.</p>
              </div>
            </div>
            
            <div className="space-y-2 mt-6">
              <Label htmlFor="name">Display Name (Institution or Full Name)</Label>
              <Input id="name" name="name" required placeholder={role === 'DONOR' ? "John Doe" : "City Hospital"} className="h-12" />
            </div>

            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
