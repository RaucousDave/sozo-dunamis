"use client";

import { useState, type ComponentType, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Activity,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FileText,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  Settings,
  ShieldCheck,
  Stethoscope,
  UserCog,
  Users,
  Zap,
} from "lucide-react";

type NavItemConfig = {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  badge?: number;
};

type NavGroup = {
  label: string;
  items: NavItemConfig[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Core",
    items: [
      { href: "/", icon: LayoutDashboard, label: "Overview" },
      {
        href: "/appointments",
        icon: CalendarDays,
        label: "Appointments",
      },
      { href: "/patients", icon: Users, label: "Patients" },
      {
        href: "/clinical",
        icon: Stethoscope,
        label: "Clinical Records",
      },
    ],
  },
  {
    label: "Operations",
    items: [
    
      { href: "/inventory", icon: Package, label: "Inventory" },
      { href: "/lab", icon: FlaskConical, label: "Lab Orders" },
      {
        href: "/prescriptions",
        icon: ClipboardList,
        label: "Prescriptions",
      },
      { href: "/reports", icon: FileText, label: "Reports" },
    ],
  },
  {
    label: "Staff",
    items: [
      { href: "/staff", icon: UserCog, label: "Staff Management" },
      {
        href: "/messages",
        icon: MessageSquare,
        label: "Messages",
        badge: 4,
      },
      { href: "/activity", icon: Activity, label: "Activity Log" },
    ],
  },
  {
    label: "System",
    items: [
      {
        href: "/roles",
        icon: ShieldCheck,
        label: "Roles & Permissions",
      },
      { href: "/settings", icon: Settings, label: "Settings" },
    ],
  },
];

function NavItem({
  item,
  collapsed,
  active,
}: {
  item: NavItemConfig;
  collapsed: boolean;
  active: boolean;
}) {
  const Icon = item.icon;

  const content = (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        collapsed && "justify-center px-2",
      )}
    >
      <Icon
        className={cn(
          "shrink-0 transition-transform duration-200",
          collapsed ? "h-5 w-5" : "h-4 w-4",
          !active && "group-hover:scale-110",
        )}
      />

      {!collapsed ? (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge ? (
            <Badge
              variant="secondary"
              className="h-5 min-w-5 rounded-full bg-primary/15 px-1.5 text-[10px] font-semibold text-primary"
            >
              {item.badge}
            </Badge>
          ) : null}
        </>
      ) : null}

      {collapsed && item.badge ? (
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
      ) : null}
    </Link>
  );

  if (!collapsed) return content;

  return (
    <Tooltip>
      <TooltipTrigger render={content} />
      <TooltipContent side="right" className="flex items-center gap-2">
        {item.label}
        {item.badge ? (
          <Badge variant="secondary" className="h-4 px-1 text-[10px]">
            {item.badge}
          </Badge>
        ) : null}
      </TooltipContent>
    </Tooltip>
  );
}

function SidebarNav({ collapsed, pathname }: { collapsed: boolean; pathname: string }) {
  return (
    <nav className="flex-1 overflow-y-auto px-2 py-4">
      <TooltipProvider delay={0}>
        {NAV_GROUPS.map((group, index) => (
          <div key={group.label} className={cn(index > 0 && "mt-6")}>
            {!collapsed ? (
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
                {group.label}
              </p>
            ) : null}
            {collapsed && index > 0 ? (
              <Separator className="my-3 bg-sidebar-border" />
            ) : null}
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <NavItem item={item} collapsed={collapsed} active={pathname === item.href} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </TooltipProvider>
    </nav>
  );
}

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "relative flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex items-center border-b border-sidebar-border px-4 py-4",
          collapsed ? "justify-center px-2" : "gap-3",
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary shadow-sm">
          <Zap className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
        </div>
        {!collapsed ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-bold tracking-tight text-sidebar-foreground">
              Sozo Dunamis
            </p>
            <p className="truncate text-[10px] font-medium uppercase tracking-widest text-sidebar-foreground/50">
              Dental Clinic
            </p>
          </div>
        ) : null}
      </div>

      <SidebarNav collapsed={collapsed} pathname={pathname} />

      <Button
        variant="outline"
        size="icon"
        onClick={onToggle}
        className="absolute -right-3.5 top-20 z-10 h-7 w-7 rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm hover:bg-sidebar-accent"
      >
        {collapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </Button>
    </aside>
  );
}

function Topbar() {
  const pathname = usePathname();
  const segment = pathname.split("/").filter(Boolean).pop() ?? "overview";
  const pageTitle =
    segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      <h1 className="text-sm font-semibold text-foreground">{pageTitle}</h1>
      <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
        <LogOut className="h-4 w-4" />
        Sign out
      </Button>
    </header>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:flex">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}