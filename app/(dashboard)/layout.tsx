"use client";

import { useState, type ComponentType, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Activity,
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FileText,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Menu,
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
      { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
      {
        href: "/dashboard/appointments",
        icon: CalendarDays,
        label: "Appointments",
      },
      { href: "/dashboard/patients", icon: Users, label: "Patients" },
      {
        href: "/dashboard/clinical",
        icon: Stethoscope,
        label: "Clinical Records",
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        href: "/dashboard/billing",
        icon: CreditCard,
        label: "Billing & Invoices",
      },
      { href: "/dashboard/inventory", icon: Package, label: "Inventory" },
      { href: "/dashboard/lab", icon: FlaskConical, label: "Lab Orders" },
      {
        href: "/dashboard/prescriptions",
        icon: ClipboardList,
        label: "Prescriptions",
      },
      { href: "/dashboard/reports", icon: FileText, label: "Reports" },
    ],
  },
  {
    label: "Staff",
    items: [
      { href: "/dashboard/staff", icon: UserCog, label: "Staff Management" },
      {
        href: "/dashboard/messages",
        icon: MessageSquare,
        label: "Messages",
        badge: 4,
      },
      { href: "/dashboard/activity", icon: Activity, label: "Activity Log" },
    ],
  },
  {
    label: "System",
    items: [
      {
        href: "/dashboard/roles",
        icon: ShieldCheck,
        label: "Roles & Permissions",
      },
      { href: "/dashboard/settings", icon: Settings, label: "Settings" },
    ],
  },
];

const CLINIC_BRAND = {
  name: "Sozo Dunamis",
  subtitle: "Dental Clinic",
};

const DOCTOR_PROFILE = {
  initials: "DR",
  name: "Dr. Rejoice Okon",
  role: "Chief Dentist",
  avatarSrc: "/doctor-avatar.jpg",
};

const DATE_FORMATTER = new Intl.DateTimeFormat("en-NG", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Africa/Lagos",
});

function BrandMark() {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary shadow-sm">
      <Zap className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
    </div>
  );
}

function BrandText() {
  return (
    <div className="min-w-0">
      <p className="truncate text-sm font-bold tracking-tight text-sidebar-foreground">
        {CLINIC_BRAND.name}
      </p>
      <p className="truncate text-[10px] font-medium uppercase tracking-widest text-sidebar-foreground/50">
        {CLINIC_BRAND.subtitle}
      </p>
    </div>
  );
}

function ProfileSummary() {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-3 py-2.5">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={DOCTOR_PROFILE.avatarSrc} />
        <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground">
          {DOCTOR_PROFILE.initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-sidebar-foreground">
          {DOCTOR_PROFILE.name}
        </p>
        <p className="truncate text-[10px] text-sidebar-foreground/50">
          {DOCTOR_PROFILE.role}
        </p>
      </div>
      <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
    </div>
  );
}

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
      {active && !collapsed ? (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary-foreground/60" />
      ) : null}

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

  if (!collapsed) {
    return content;
  }

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

function SidebarNav({
  collapsed,
  pathname,
}: {
  collapsed: boolean;
  pathname: string;
}) {
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
                  <NavItem
                    item={item}
                    collapsed={collapsed}
                    active={pathname === item.href}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </TooltipProvider>
    </nav>
  );
}

function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
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
        <BrandMark />
        {!collapsed ? <BrandText /> : null}
      </div>

      <SidebarNav collapsed={collapsed} pathname={pathname} />

      {!collapsed ? (
        <div className="border-t border-sidebar-border p-3">
          <ProfileSummary />
        </div>
      ) : null}

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

function MobileNavigation({ pathname }: { pathname: string }) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Menu className="h-5 w-5" />
          </Button>
        }
      />
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-full flex-col bg-sidebar">
          <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-4">
            <BrandMark />
            <BrandText />
          </div>
          <SidebarNav collapsed={false} pathname={pathname} />
          <div className="border-t border-sidebar-border p-3">
            <ProfileSummary />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Topbar({ mobileMenuTrigger }: { mobileMenuTrigger: ReactNode }) {
  const pathname = usePathname();
  const segment = pathname.split("/").filter(Boolean).pop() ?? "dashboard";
  const pageTitle = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      <div className="flex items-center gap-3">
        <div className="md:hidden">{mobileMenuTrigger}</div>
        <div>
          <h1 className="text-base font-semibold text-foreground">{pageTitle}</h1>
          <p className="hidden text-xs text-muted-foreground sm:block">
            {DATE_FORMATTER.format(new Date())}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="ghost" size="icon" className="relative h-9 w-9">
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
                </Button>
              }
            />
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="flex h-9 items-center gap-2.5 rounded-lg px-2 hover:bg-accent"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src={DOCTOR_PROFILE.avatarSrc} />
                  <AvatarFallback className="bg-primary text-[10px] font-bold text-primary-foreground">
                    {DOCTOR_PROFILE.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-semibold leading-none text-foreground">
                    {DOCTOR_PROFILE.name}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {DOCTOR_PROFILE.role}
                  </p>
                </div>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              Signed in as
            </DropdownMenuLabel>
            <DropdownMenuLabel className="-mt-1 text-sm">
              {DOCTOR_PROFILE.name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              render={<Link href="/dashboard/settings" className="cursor-pointer" />}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              render={<Link href="/dashboard/activity" className="cursor-pointer" />}
            >
              <Activity className="mr-2 h-4 w-4" />
              Activity Log
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:flex">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((current) => !current)}
        />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar mobileMenuTrigger={<MobileNavigation pathname={pathname} />} />
        <main className="flex-1 overflow-y-auto">
          <div className="h-full p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
