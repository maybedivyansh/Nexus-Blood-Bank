"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Droplet, Map, Stethoscope, Search, PackageSearch, ShieldCheck, HeartPulse, Hospital, LogOut, Package, CalendarDays, CalendarPlus } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";

export function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const navConfig: Record<string, any[]> = {
    HOSPITAL: [
      { name: "Dashboard", href: "/dashboard/hospital", icon: Activity },
      { name: "Search & Request", href: "/dashboard/hospital/request", icon: Search },
      { name: "Track Orders", href: "/dashboard/hospital/orders", icon: Package },
    ],
    BANK: [
      { name: "Command Center", href: "/dashboard/bank", icon: ShieldCheck },
      { name: "Inventory Management", href: "/dashboard/bank/inventory", icon: Droplet },
      { name: "Demand Queue", href: "/dashboard/bank/orders-management", icon: PackageSearch },
      { name: "Donor Schedule", href: "/dashboard/bank/schedule", icon: CalendarDays },
    ],
    DONOR: [
      { name: "Hero Overview", href: "/dashboard/donor", icon: HeartPulse },
      { name: "Book Donation", href: "/dashboard/donor/book", icon: CalendarPlus },
      { name: "Find a Drive", href: "/dashboard/donor/find-bank", icon: Map },
      { name: "My Impact History", href: "/dashboard/donor/history", icon: Activity },
    ],
  };

  const navItems = navConfig[role] || navConfig.DONOR;

  return (
    <div className="w-64 h-screen border-r bg-card flex flex-col justify-between p-4 sticky top-0">
      <div>
        <div className="flex items-center gap-2 mb-8 px-2">
           <Droplet className="h-6 w-6 text-primary fill-primary/20" />
           <h1 className="text-xl font-bold tracking-tight">NexusBlood</h1>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all font-medium ${
                  isActive 
                    ? "bg-primary/10 text-primary pointer-events-none" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      
      <div className="mt-auto flex flex-col gap-4">
         <div className="border-t pt-4 px-2 flex items-center justify-between gap-3 min-h-[50px]">
           <UserButton showName />
           <Badge variant="outline" className="ml-auto text-[10px] uppercase tracking-wider">{role}</Badge>
         </div>
      </div>
    </div>
  );
}
