import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  async function handleSignOut() {
    "use server";
    await signOut();
  }

  return (
    <DashboardShell userName={session.user.name ?? ""} onSignOut={handleSignOut}>
      {children}
    </DashboardShell>
  );
}