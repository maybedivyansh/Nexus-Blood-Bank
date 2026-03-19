"use client";

import { useState } from "react";
import { registerUser } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, HeartPulse, ShieldCheck, ArrowRight } from "lucide-react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full mt-6" disabled={pending}>
      {pending ? "Creating Account..." : "Complete Registration"}
    </Button>
  );
}

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"DONOR" | "HOSPITAL" | "BANK">("DONOR");

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-lg shadow-xl border-primary/10">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-extrabold tracking-tight">Join NexusBlood</CardTitle>
          <CardDescription className="text-base mt-2">
            {step === 1 ? "Choose your account type to proceed." : "Tell us a bit more about you."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={registerUser}>
            {step === 1 && (
              <div className="space-y-4">
                <input type="hidden" name="role" value={role} />
                <div 
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center gap-4 ${role === "DONOR" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}
                  onClick={() => setRole("DONOR")}
                >
                  <div className="p-3 bg-primary/10 text-primary rounded-lg"><HeartPulse /></div>
                  <div>
                    <h3 className="font-bold text-lg">Individual Donor</h3>
                    <p className="text-sm text-muted-foreground">Donate blood and track your impact.</p>
                  </div>
                </div>

                <div 
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center gap-4 ${role === "HOSPITAL" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}
                  onClick={() => setRole("HOSPITAL")}
                >
                  <div className="p-3 bg-primary/10 text-primary rounded-lg"><Building2 /></div>
                  <div>
                    <h3 className="font-bold text-lg">Hospital</h3>
                    <p className="text-sm text-muted-foreground">Request emergency blood stocks.</p>
                  </div>
                </div>

                <div 
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center gap-4 ${role === "BANK" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}
                  onClick={() => setRole("BANK")}
                >
                  <div className="p-3 bg-primary/10 text-primary rounded-lg"><ShieldCheck /></div>
                  <div>
                    <h3 className="font-bold text-lg">Blood Bank</h3>
                    <p className="text-sm text-muted-foreground">Manage inventory and fulfill orders.</p>
                  </div>
                </div>

                <Button type="button" onClick={() => setStep(2)} className="w-full mt-6 gap-2" size="lg">
                  Continue <ArrowRight size={18} />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <input type="hidden" name="role" value={role} />

                <div className="space-y-2">
                  <Label htmlFor="name">{role === 'HOSPITAL' || role === 'BANK' ? 'Organization Name' : 'Full Name'}</Label>
                  <Input id="name" name="name" required placeholder={role === 'DONOR' ? "John Doe" : "City Hospital"} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" required placeholder="contact@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>


                {/* Role Specific Fields */}
                {role === "HOSPITAL" && (
                  <div className="space-y-2">
                    <Label htmlFor="license">Medical Institution License ID</Label>
                    <Input id="license" name="license" required placeholder="MED-12345" />
                  </div>
                )}
                
                {role === "DONOR" && (
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <select id="bloodGroup" name="bloodGroup" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="O+">O Positive (O+)</option>
                      <option value="O-">O Negative (O-)</option>
                      <option value="A+">A Positive (A+)</option>
                      <option value="A-">A Negative (A-)</option>
                      <option value="B+">B Positive (B+)</option>
                      <option value="B-">B Negative (B-)</option>
                      <option value="AB+">AB Positive (AB+)</option>
                      <option value="AB-">AB Negative (AB-)</option>
                    </select>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-1/3">
                    Back
                  </Button>
                  <div className="w-2/3">
                    <SubmitButton />
                  </div>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
