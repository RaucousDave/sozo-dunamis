"use client";

import { useState, type ElementType } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarCheck2,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock,
  FlaskConical,
  Hourglass,
  MoreHorizontal,
  Package,
  Plus,
  ShieldAlert,
  Smile,
  Stethoscope,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DATE_FORMATTER = new Intl.DateTimeFormat("en-NG", {
  dateStyle: "long",
  timeZone: "Africa/Lagos",
});

const HOUR_FORMATTER = new Intl.DateTimeFormat("en-NG", {
  hour: "numeric",
  hour12: false,
  timeZone: "Africa/Lagos",
});

type Trend = "up" | "down" | "neutral";
type AppointmentStatus =
  | "confirmed"
  | "waiting"
  | "in-progress"
  | "completed"
  | "cancelled";

interface StatCard {
  label: string;
  value: string;
  sub: string;
  trend: Trend;
  trendValue: string;
  icon: ElementType;
  iconBg: string;
  iconColor: string;
}

interface Appointment {
  id: string;
  patient: string;
  initials: string;
  procedure: string;
  time: string;
  dentist: string;
  status: AppointmentStatus;
}

interface AlertItem {
  id: string;
  type: "low-stock" | "lab" | "follow-up" | "overdue";
  message: string;
  detail: string;
  icon: ElementType;
  color: string;
}

const STATS: StatCard[] = [
  {
    label: "Today's Appointments",
    value: "24",
    sub: "6 remaining",
    trend: "up",
    trendValue: "12% vs yesterday",
    icon: CalendarCheck2,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    label: "Active Patients",
    value: "1,284",
    sub: "18 new this week",
    trend: "up",
    trendValue: "5.2% this month",
    icon: Users,
    iconBg: "bg-blue-50 dark:bg-blue-950/40",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    label: "Revenue (This Month)",
    value: "NGN 4.82M",
    sub: "Target: NGN 6M",
    trend: "up",
    trendValue: "8.1% vs last month",
    icon: CircleDollarSign,
    iconBg: "bg-amber-50 dark:bg-amber-950/40",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    label: "Pending Lab Orders",
    value: "7",
    sub: "2 overdue",
    trend: "down",
    trendValue: "3 resolved today",
    icon: FlaskConical,
    iconBg: "bg-rose-50 dark:bg-rose-950/40",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
];

const APPOINTMENTS: Appointment[] = [
  {
    id: "A001",
    patient: "Emeka Okonkwo",
    initials: "EO",
    procedure: "Root Canal Therapy",
    time: "08:00 AM",
    dentist: "Dr. Rejoice Okon",
    status: "completed",
  },
  {
    id: "A002",
    patient: "Ngozi Adeyemi",
    initials: "NA",
    procedure: "Teeth Whitening",
    time: "09:30 AM",
    dentist: "Dr. James Eze",
    status: "completed",
  },
  {
    id: "A003",
    patient: "Chukwudi Nwosu",
    initials: "CN",
    procedure: "Dental Implant Consult",
    time: "10:00 AM",
    dentist: "Dr. Rejoice Okon",
    status: "in-progress",
  },
  {
    id: "A004",
    patient: "Aisha Bello",
    initials: "AB",
    procedure: "Routine Cleaning",
    time: "11:15 AM",
    dentist: "Dr. Tunde Fadipe",
    status: "waiting",
  },
  {
    id: "A005",
    patient: "Biodun Olatunji",
    initials: "BO",
    procedure: "Wisdom Tooth Extraction",
    time: "12:00 PM",
    dentist: "Dr. James Eze",
    status: "confirmed",
  },
  {
    id: "A006",
    patient: "Fatima Yusuf",
    initials: "FY",
    procedure: "Orthodontic Review",
    time: "02:00 PM",
    dentist: "Dr. Tunde Fadipe",
    status: "confirmed",
  },
  {
    id: "A007",
    patient: "Seun Adeleke",
    initials: "SA",
    procedure: "Crown Fitting",
    time: "03:30 PM",
    dentist: "Dr. Rejoice Okon",
    status: "cancelled",
  },
];

const ALERTS: AlertItem[] = [
  {
    id: "1",
    type: "low-stock",
    message: "Low inventory: Composite resin",
    detail: "Only 3 units remaining",
    icon: Package,
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "2",
    type: "lab",
    message: "Lab order #LB-0042 overdue",
    detail: "Crown for Adaeze Obi - 2 days late",
    icon: FlaskConical,
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "3",
    type: "follow-up",
    message: "Follow-up due: Emeka Okonkwo",
    detail: "Post root canal check - scheduled tomorrow",
    icon: UserCheck,
    color: "text-primary",
  },
  {
    id: "4",
    type: "overdue",
    message: "Unpaid invoice #INV-0211",
    detail: "NGN 85,000 - 14 days overdue",
    icon: ShieldAlert,
    color: "text-rose-600 dark:text-rose-400",
  },
];

const DENTIST_WORKLOAD = [
  { name: "Dr. Rejoice Okon", initials: "RO", count: 9, capacity: 12 },
  { name: "Dr. James Eze", initials: "JE", count: 8, capacity: 10 },
  { name: "Dr. Tunde Fadipe", initials: "TF", count: 7, capacity: 10 },
];

const WEEKLY_REVENUE = [
  { day: "Mon", value: 62 },
  { day: "Tue", value: 88 },
  { day: "Wed", value: 74 },
  { day: "Thu", value: 91 },
  { day: "Fri", value: 55 },
  { day: "Sat", value: 40 },
  { day: "Sun", value: 20 },
];

const QUICK_ACTIONS = [
  {
    label: "New Appointment",
    icon: CalendarClock,
    href: "/dashboard/appointments/new",
    color: "text-primary bg-primary/10 hover:bg-primary/20",
  },
  {
    label: "Register Patient",
    icon: UserPlus,
    href: "/dashboard/patients/new",
    color:
      "text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-950/40 dark:hover:bg-blue-950/70",
  },
  {
    label: "New Invoice",
    icon: CircleDollarSign,
    href: "/dashboard/billing/new",
    color:
      "text-amber-600 bg-amber-50 hover:bg-amber-100 dark:text-amber-400 dark:bg-amber-950/40",
  },
  {
    label: "Lab Order",
    icon: FlaskConical,
    href: "/dashboard/lab/new",
    color:
      "text-violet-600 bg-violet-50 hover:bg-violet-100 dark:text-violet-400 dark:bg-violet-950/40",
  },
  {
    label: "Clinical Note",
    icon: Stethoscope,
    href: "/dashboard/clinical/new",
    color:
      "text-teal-600 bg-teal-50 hover:bg-teal-100 dark:text-teal-400 dark:bg-teal-950/40",
  },
  {
    label: "Check Inventory",
    icon: Package,
    href: "/dashboard/inventory",
    color:
      "text-orange-600 bg-orange-50 hover:bg-orange-100 dark:text-orange-400 dark:bg-orange-950/40",
  },
];

const STATUS_MAP: Record<
  AppointmentStatus,
  { label: string; className: string }
> = {
  confirmed: {
    label: "Confirmed",
    className:
      "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900",
  },
  waiting: {
    label: "Waiting",
    className:
      "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  completed: {
    label: "Completed",
    className: "bg-muted text-muted-foreground border-border",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900",
  },
};

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const { label, className } = STATUS_MAP[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
        className,
      )}
    >
      {status === "in-progress" ? (
        <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
      ) : null}
      {label}
    </span>
  );
}

function StatCardItem({ card }: { card: StatCard }) {
  const Icon = card.icon;
  const isUp = card.trend === "up";
  const TrendIcon = isUp ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="relative overflow-hidden border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {card.label}
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
              {card.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{card.sub}</p>
          </div>
          <div className={cn("rounded-xl p-2.5", card.iconBg)}>
            <Icon className={cn("h-5 w-5", card.iconColor)} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1.5">
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-semibold",
              isUp ? "text-primary" : "text-rose-500",
            )}
          >
            <TrendIcon className="h-3.5 w-3.5" />
            {card.trendValue}
          </span>
        </div>
      </CardContent>
      <div
        className={cn(
          "absolute bottom-0 left-0 h-0.5 w-full opacity-60",
          isUp ? "bg-primary" : "bg-rose-400",
        )}
      />
    </Card>
  );
}

function RevenueChart() {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-semibold">Weekly Revenue</CardTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">
            This week vs target
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary">+8.1%</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2 pt-2" style={{ height: 100 }}>
          {WEEKLY_REVENUE.map((day) => (
            <div
              key={day.day}
              className="flex flex-1 flex-col items-center gap-1.5"
            >
              <div
                className="relative w-full overflow-hidden rounded-t-sm bg-muted"
                style={{ height: 80 }}
              >
                <div
                  className="absolute bottom-0 w-full rounded-t-sm bg-primary transition-all duration-700"
                  style={{ height: `${day.value}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{day.day}</span>
            </div>
          ))}
        </div>
        <Separator className="my-3" />
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Month target</span>
          <div className="flex items-center gap-2">
            <Progress value={80} className="h-1.5 w-24" />
            <span className="font-semibold text-foreground">80%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WorkloadCard() {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Dentist Workload</CardTitle>
        <p className="text-xs text-muted-foreground">Today&apos;s appointment load</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {DENTIST_WORKLOAD.map((dentist) => {
          const percentage = Math.round((dentist.count / dentist.capacity) * 100);

          return (
            <div key={dentist.name} className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary">
                    {dentist.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-1 items-center justify-between">
                  <span className="text-xs font-medium text-foreground">
                    {dentist.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {dentist.count}/{dentist.capacity}
                  </span>
                </div>
              </div>
              <Progress
                value={percentage}
                className={cn(
                  "h-1.5",
                  percentage >= 90
                    ? "[&>[data-slot=progress-indicator]]:bg-rose-500"
                    : percentage >= 70
                      ? "[&>[data-slot=progress-indicator]]:bg-amber-500"
                      : "[&>[data-slot=progress-indicator]]:bg-primary",
                )}
              />
            </div>
          );
        })}

        <Separator />

        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { icon: Smile, label: "Satisfied", value: "94%" },
            { icon: Clock, label: "Avg Wait", value: "12m" },
            { icon: Hourglass, label: "Avg Appt", value: "45m" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-lg bg-muted p-2">
              <Icon className="mx-auto mb-1 h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-sm font-bold text-foreground">{value}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AlertsPanel() {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-semibold">Action Required</CardTitle>
          <p className="text-xs text-muted-foreground">
            {ALERTS.length} items need attention
          </p>
        </div>
        <Badge
          variant="destructive"
          className="h-5 rounded-full px-1.5 text-[10px]"
        >
          {ALERTS.length}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-1 p-3 pt-0">
        {ALERTS.map((alert) => {
          const Icon = alert.icon;

          return (
            <div
              key={alert.id}
              className="cursor-pointer rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/60"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  <Icon className={cn("h-4 w-4", alert.color)} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground">
                    {alert.message}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {alert.detail}
                  </p>
                </div>
                <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function AppointmentsTable() {
  const [filter, setFilter] = useState<string>("all");

  const filteredAppointments =
    filter === "all"
      ? APPOINTMENTS
      : APPOINTMENTS.filter((appointment) => appointment.status === filter);

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 pb-3">
        <div>
          <CardTitle className="text-sm font-semibold">
            Today&apos;s Appointments
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {APPOINTMENTS.length} total | {DATE_FORMATTER.format(new Date())}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={(value) => setFilter(value ?? "all")}>
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="waiting">Waiting</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Link
            href="/dashboard/appointments/new"
            className={cn(buttonVariants({ size: "sm" }), "h-8 gap-1.5 text-xs")}
          >
            <Plus className="h-3.5 w-3.5" />
            New
          </Link>
        </div>
      </CardHeader>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              {["Patient", "Procedure", "Time", "Dentist", "Status", ""].map(
                (heading) => (
                  <TableHead
                    key={heading}
                    className="h-8 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {heading}
                  </TableHead>
                ),
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredAppointments.map((appointment) => (
              <TableRow
                key={appointment.id}
                className="border-border transition-colors hover:bg-muted/40"
              >
                <TableCell className="py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary">
                        {appointment.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-foreground">
                      {appointment.patient}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-xs text-foreground">
                  {appointment.procedure}
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {appointment.time}
                  </div>
                </TableCell>
                <TableCell className="py-3 text-xs text-muted-foreground">
                  {appointment.dentist}
                </TableCell>
                <TableCell className="py-3">
                  <StatusBadge status={appointment.status} />
                </TableCell>
                <TableCell className="py-3">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredAppointments.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No appointments match this filter.
          </div>
        ) : null}
      </div>

      <div className="border-t border-border px-6 py-3">
        <Link
          href="/dashboard/appointments"
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          View all appointments
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const hour = Number(HOUR_FORMATTER.format(new Date()));
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {greeting}, Dr. Rejoice
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening at Sozo Dunamis today.
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
          <CheckCircle2 className="h-3.5 w-3.5" />
          All systems normal
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((card) => (
          <StatCardItem key={card.label} card={card} />
        ))}
      </div>

      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Quick Actions
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {QUICK_ACTIONS.map(({ label, icon: Icon, href, color }) => (
            <Link
              key={label}
              href={href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "flex h-auto flex-col items-center gap-2 rounded-xl border border-border py-4 text-center transition-all hover:scale-[1.02] hover:border-transparent hover:shadow-sm",
                color,
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[11px] font-semibold leading-tight">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <RevenueChart />
        <WorkloadCard />
        <AlertsPanel />
      </div>

      <AppointmentsTable />
    </div>
  );
}
