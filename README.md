# 🩸 NexusBlood

> The Modern Blood Management Cloud

NexusBlood is a full-stack, role-based SaaS platform designed to modernize the medical supply chain. It connects autonomous Donors, Hospitals, and Blood Banks into a single real-time ecosystem, eliminating critical supply shortages through predictive appointment telemetry and native cloud inventory synchronization.

## 🚀 Key Features

* **Role-Based Workspaces**: Completely segregated, highly secure dashboard views explicitly tailored for Individual Donors, Hospitals, and Blood Banks handled by Edge-rendered Node authentication.
* **Real-time Demand Queue**: Hospitals can instantly locate live, healthy platelet inventories and submit zero-latency direct fulfillment requests to surrounding active Blood Banks.
* **Predictive Inventory Mapping**: A dynamic stock-management table that autonomously replenishes valid physical unit counts the instant registered Donor Appointments physically arrive and complete verifiable donations.
* **IoT Storage Metrics Simulator**: Live chronological chart interfaces mapped natively to hardware mock-simulations verifying viable temperatures across blood bank vaults (`2.0°C - 6.0°C`).

## 🛠 Tech Stack

* **Framework**: [Next.js 14](https://nextjs.org/) (App Router & React Server Components)
* **Database**: [Supabase](https://supabase.com/) (PostgreSQL Cloud Instance + Transaction Pooler)
* **ORM**: [Prisma](https://www.prisma.io/) (Fully-Typed Edge Architecture)
* **Authentication**: [Clerk](https://clerk.dev/) (Native Next.js Server Integration)
* **Design & Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/) (Lucide Icons)

## 📦 Local Installation

To run this project locally, ensure you have active Node modules and secure environment variables mapped to your active cloud providers.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/nexusblood.git
   cd nexusblood
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a root `.env` file and insert your configuration keys.
   ```env
   # Clerk Keys
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...

   # Supabase DB (Prisma Pooler format)
   DATABASE_URL="postgresql://postgres.[ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connect_timeout=30"
   DIRECT_URL="postgresql://postgres.[ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
   ```

4. **Synchronize & Seed the Database:**
   ```bash
   npx prisma generate
   npx prisma db push --accept-data-loss
   npx tsx scripts/seed.ts
   ```

5. **Start the Production Engine:**
   ```bash
   npm run dev
   ```
   *Your application will securely boot at `http://localhost:3000`.*
