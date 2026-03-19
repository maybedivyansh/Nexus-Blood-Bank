import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Initiating NexusBlood Cloud Seeding Protocol...");

  console.log("Sweeping legacy entities for idempotent injection...");
  await prisma.donationAppointment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.storageMetric.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create simulated Blood Banks
  const banks = [
    { name: "Central City Blood Bank", lat: 40.7128, lon: -74.0060 },
    { name: "Metro General Vault", lat: 40.7300, lon: -73.9950 },
    { name: "Global Health Reserves", lat: 40.7500, lon: -73.9800 }
  ];

  console.log("Injecting primary Blood Bank nodes...");
  const createdBanks = await Promise.all(
    banks.map(bank => 
      prisma.user.create({
        data: {
          email: `${bank.name.replace(/\s+/g, '').toLowerCase()}@nexus.local`,
          name: bank.name,
          clerkId: `bank_${Math.random().toString(36).substring(7)}`,
          internal_role: "BANK",
          latitude: bank.lat,
          longitude: bank.lon
        }
      })
    )
  );

  // 2. Populate their inventory
  console.log("Stocking Vaults with O+ and A- units...");
  const bloodTypes = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
  
  for (const bank of createdBanks) {
    for (const bg of bloodTypes) {
      // Give them random stock between 0 and 20 units
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 42); // 42 days expiry
      
      await prisma.inventory.create({
        data: {
          bankId: bank.id,
          bloodType: bg,
          units: Math.floor(Math.random() * 20),
          expiryDate: futureDate,
        }
      });
    }
    
    // 3. Inject some IoT Storage Metrics
    await prisma.storageMetric.create({
      data: {
        bankId: bank.id,
        temp: 4.2
      }
    });
  }

  // 4. Create a simulated Hospital
  console.log("Bootstrapping Hospital node...");
  const hospital = await prisma.user.create({
    data: {
      email: "urgentcare@nexus.local",
      name: "St. Patrick Urgent Care",
      clerkId: `hosp_${Math.random().toString(36).substring(7)}`,
      internal_role: "HOSPITAL",
      latitude: 40.7400,
      longitude: -73.9900
    }
  });

  console.log("✅ Cloud Seeding Complete! Supabase has been prepopulated.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding Failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
