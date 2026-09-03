"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";

export function DashboardShell({
  userName,
  onSignOut,
  children,
}: {
  userName: string;
  onSignOut: () => Promise<void>;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar
        userName={userName}
        onSignOut={onSignOut}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
      />
      <div className={collapsed ? "lg:pl-16" : "lg:pl-64"}>
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}