import Link from "next/link";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border px-8 py-4">
        <div className="flex items-center gap-6">
  <h1 className="text-2xl font-bold tracking-tight">Trading Journal</h1>
  <nav className="flex gap-4">
    <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
      Dashboard
    </Link>
    <Link href="/dashboard/trades" className="text-sm text-muted-foreground hover:text-foreground">
      Trades
    </Link>
    <Link href="/dashboard/analytics" className="text-sm text-muted-foreground hover:text-foreground">
      Analytics
    </Link>
  </nav>
</div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{session.user.name}</span>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button type="submit" variant="outline" size="sm">
            Sign out
            </Button>
          </form>
        </div>
      </header>
      <main className="p-8">{children}</main>
    </div>
  );
}