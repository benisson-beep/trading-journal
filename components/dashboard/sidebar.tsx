"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Menu,
  X,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/trades", label: "Trades", icon: ClipboardList },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
];

export function Sidebar({
  userName,
  onSignOut,
  collapsed,
  onToggleCollapsed,
}: {
  userName: string;
  onSignOut: () => Promise<void>;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === href;
    return pathname.startsWith(href);
  }

  function navLinks(showLabels: boolean) {
    return (
      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              title={showLabels ? undefined : label}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                showLabels ? "" : "justify-center"
              } ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {showLabels && label}
            </Link>
          );
        })}
      </nav>
    );
  }

  function footer(showLabel: boolean) {
    return (
      <div className="border-t border-sidebar-border p-3">
        <div
          className={`flex items-center gap-2 rounded-lg px-2 py-2 ${
            showLabel ? "justify-between" : "justify-center"
          }`}
        >
          {showLabel && (
            <span className="min-w-0 flex-1 truncate text-sm text-sidebar-foreground/70">
              {userName}
            </span>
          )}
          <form action={onSignOut}>
            <button
              type="submit"
              title="Sign out"
              className="rounded-md p-1.5 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-sidebar-border bg-sidebar px-4 py-3 lg:hidden">
        <span className="text-lg font-bold tracking-tight text-sidebar-foreground">
          Trading Journal
        </span>
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-md p-2 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile slide-over (always full labels, collapse is desktop-only) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-64 flex-col bg-sidebar">
            <div className="flex items-center justify-between px-4 py-4">
              <span className="text-lg font-bold tracking-tight text-sidebar-foreground">
                Trading Journal
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-1.5 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {navLinks(true)}
            {footer(true)}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div
        className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col lg:border-r lg:border-sidebar-border lg:bg-sidebar lg:transition-all lg:duration-200 ${
          collapsed ? "lg:w-16" : "lg:w-64"
        }`}
      >
        <div
          className={`flex items-center px-5 py-5 ${
            collapsed ? "justify-center px-0" : "justify-between"
          }`}
        >
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-sidebar-foreground">
              Trading Journal
            </span>
          )}
          <button
            onClick={onToggleCollapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="rounded-md p-1.5 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>
        {navLinks(!collapsed)}
        {footer(!collapsed)}
      </div>
    </>
  );
}