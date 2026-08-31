import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";

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
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar
        userName={session.user.name ?? ""}
        onSignOut={handleSignOut}
      />
      <div className="lg:pl-64">
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}