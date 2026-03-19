import { db } from "@/lib/db";
import { DonorMap } from "@/components/donor-map";

export const dynamic = "force-dynamic";

export default async function FindBankPage() {
  // Query all users configured as BLOOD_BANK
  const banks = await db.user.findMany({
    where: { internal_role: "BANK" },
  });

  // Transform db records into Map Markers.
  // We apply a mock radius around NYC since `User` doesn't store Lat/Lng in the generic schema yet.
  const NYC_LAT = 40.7128;
  const NYC_LNG = -74.0060;

  const drives = banks.map((bank, index) => ({
    id: bank.id,
    name: bank.name,
    // Add small mathematical jitter to spread them around the NYC map anchor
    lat: NYC_LAT + (index * 0.02) - 0.01,
    lng: NYC_LNG + (index * 0.02) - 0.01,
  }));

  // If local DB has no banks yet, inject one so the map isn't completely empty
  if (drives.length === 0) {
    drives.push({
      id: "mock-1",
      name: "Central Valley Blood Center",
      lat: NYC_LAT + 0.01,
      lng: NYC_LNG - 0.02,
    });
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Nearby Blood Banks & Drives</h2>
        <p className="text-muted-foreground mt-1">Locate a registered blood center near you and book an appointment.</p>
      </div>
      
      <div className="border rounded-xl bg-card shadow-sm p-2">
        <DonorMap drives={drives} />
      </div>
    </div>
  );
}
