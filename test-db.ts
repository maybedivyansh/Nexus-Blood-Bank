import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("Connecting to Supabase Database...");
    const users = await prisma.user.findMany({ take: 1 });
    console.log("Connection Successful! Found users:", users.length);
  } catch (err: any) {
    console.error("Connection Failed. Error Code:", err.code);
    console.error(err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
