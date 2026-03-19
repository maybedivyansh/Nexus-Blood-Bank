import { getAuthUser } from "@/lib/actions/auth";

export const dynamic = "force-dynamic";

export default async function DebugRolePage() {
  let role = "NOT FOUND";
  let userId = "UNKNOWN";
  let clerkIdent = "UNKNOWN";
  
  try {
    const user = await getAuthUser();
    role = user.internal_role;
    userId = user.id;
    clerkIdent = user.clerkId;
  } catch (err) {
    console.error(err);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-green-500 font-mono text-xl space-y-4 flex-col p-8">
       <h1 className="text-3xl font-bold border-b border-green-500/50 pb-2 mb-4">Role Debugger Tool</h1>
       <div className="border border-green-500 p-8 rounded-lg bg-green-500/10 space-y-4 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
         <div className="flex justify-between gap-12 border-b border-green-500/20 pb-2">
            <span className="text-green-500/70">Database Role:</span>
            <span className="font-bold text-white text-2xl">{role}</span>
         </div>
         <div className="flex justify-between gap-12 border-b border-green-500/20 pb-2">
            <span className="text-green-500/70">Internal UUID:</span>
            <span className="text-muted-foreground text-sm self-end">{userId}</span>
         </div>
         <div className="flex justify-between gap-12">
            <span className="text-green-500/70">Clerk Identity:</span>
            <span className="text-muted-foreground text-sm self-end">{clerkIdent}</span>
         </div>
       </div>
       <p className="max-w-md text-center text-sm text-green-500/60 mt-8">
         This endpoint queries your active Clerk session against the PostgreSQL `User` table to extract your definitive operational role authorization.
       </p>
    </div>
  );
}
