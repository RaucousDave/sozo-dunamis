"use client";
import { useState } from "react";
import { Eye, EyeOff, Stethoscope } from "lucide-react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const roles = [
  { label: "Administrator", value: "Administrator" },
  { label: "Dentist", value: "Dentist" },
  { label: "Receptionist", value: "Receptionist" },
] as const;

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setIsLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: role.toLowerCase(), email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setIsLoading(false);
      toast.error(data.error);
      return;
    }
    setIsLoading(false);
    toast.success(data.message);
    router.refresh();
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground">
      {/* ── Left: Form panel ── */}
      <div className="flex basis-120 flex-col justify-center border-r border-border bg-card px-14 py-12">
        {/* Brand */}
        <div className="mb-12 flex items-center gap-2.5">
          <div className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-md bg-foreground text-card">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[15px] font-semibold tracking-[-0.3px] leading-none">
              Sozo Dunamis
            </div>
            <div className="text-[11px] uppercase tracking-[0.6px] text-muted-foreground">
              ERP System
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="mb-1.5 text-[28px] font-bold tracking-[-0.6px] text-foreground">
            Sign in
          </h1>
          <p className="m-0 text-sm text-muted-foreground">
            Access your clinic workspace
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-[1.1rem]">
          {/* Role */}
          <div>
            <label className={labelClassName}>Role</label>
            <Combobox
              value={role}
              onValueChange={(value) => setRole(value ?? "")}
            >
              <ComboboxInput
                className="**:data-[slot=input-group]:w-full **:data-[slot=input-group-input]:h-10 **:data-[slot=input-group-input]:rounded-md **:data-[slot=input-group-input]:border-input **:data-[slot=input-group-input]:bg-background **:data-[slot=input-group-input]:text-sm"
                placeholder="Select your role"
                aria-label="Role"
              />
              <ComboboxContent>
                <ComboboxEmpty>No role found.</ComboboxEmpty>
                <ComboboxList>
                  {roles.map((item) => (
                    <ComboboxItem key={item.value} value={item.value}>
                      {item.label}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          {/* Email */}
          <div>
            <label className={labelClassName}>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@clinic.com"
              required
              className={inputClassName}
            />
          </div>

          {/* Password */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className={`${labelClassName} mb-0`}>Password</label>
              <a
                href="#"
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={`${inputClassName} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center p-0 text-muted-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          {!isLoading ? (
            <button
              type="submit"
              className="mt-2 h-10.5 w-full rounded-md bg-primary text-sm font-medium tracking-[0.2px] text-primary-foreground transition-opacity hover:opacity-90"
            >
              Sign in to Sozo Dunamis
            </button>
          ) : (
            <button
              disabled={isLoading}
              className={`mt-2 animate-pulse h-10.5 w-full rounded-md bg-secondary text-sm font-medium tracking-[0.2px] text-primary-foreground transition-opacity hover:opacity-90`}
            >
              Signing in
            </button>
          )}
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Need access?{" "}
          <a href="#" className="font-medium text-foreground no-underline">
            Contact your administrator
          </a>
        </p>
      </div>

      {/* ── Right: Visual panel ── */}
      <div className="relative flex flex-1 bg-primary flex-col items-center justify-center overflow-hidden p-12">
        {/* Decorative rings */}
        <div className="pointer-events-none absolute h-90 w-90 rounded-full border border-border opacity-60" />
        <div className="pointer-events-none absolute h-130 w-130 rounded-full border border-border opacity-45" />
        <div className="pointer-events-none absolute h-170 w-170 rounded-full border border-border opacity-30" />

        <div className="relative mb-10 flex h-24 w-24 items-center justify-center rounded-full border border-border bg-card">
          <Stethoscope className="h-11 w-11 text-foreground/85" />
        </div>

        {/* Copy */}
        <h2 className="relative mb-4 max-w-90 text-center text-[32px] font-bold leading-[1.2] tracking-[-0.8px] text-secondary">
          Every healthy smile starts with great care.
        </h2>
        <p className="relative mb-12 max-w-75 text-center text-sm leading-[1.65] text-secondary">
          Streamline your clinic - appointments, records, billing, and your full
          team - all in one place.
        </p>

        {/* Stats */}
        {/* <div className="relative flex gap-4">
          {[
            { num: "248", label: "Patients this month" },
            { num: "12", label: "Today's appointments" },
            { num: "98%", label: "Satisfaction rate" },
          ].map(({ num, label }) => (
            <div
              key={label}
              className="min-w-[100px] rounded-lg border border-border bg-card px-[18px] py-[14px] text-center"
            >
              <div className="text-[22px] font-bold tracking-[-0.5px] text-foreground">
                {num}
              </div>
              <div className="mt-0.5 text-[11px] leading-[1.4] text-muted-foreground">
                {label}
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
}
const labelClassName =
  "mb-1.5 block text-xs font-medium tracking-[0.3px] text-muted-foreground";
const inputClassName =
  "h-10 w-full appearance-none rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20";
