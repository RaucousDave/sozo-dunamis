"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Stethoscope } from "lucide-react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { toast } from "sonner";

const roles = [
  "Administrator",
  "Dentist / Doctor",
  "Receptionist",
  "Dental Nurse",
  "Lab Technician",
];

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    if (password !== confirmPassword) return;

    console.log("Sending in password: ", password);

    setLoading(true);

    const res = await fetch("api/auth/signUp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        role: role.toLowerCase(),
        email,
        password,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error);
      setLoading(false);
      return;
    }
    setLoading(false);
    toast.success(data.message);
    router.push("/login");
    // router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground">
      {/* ── Left: Visual panel ── */}
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-primary p-12">
        <div className="pointer-events-none absolute h-[360px] w-[360px] rounded-full border border-border opacity-60" />
        <div className="pointer-events-none absolute h-[520px] w-[520px] rounded-full border border-border opacity-45" />
        <div className="pointer-events-none absolute h-[680px] w-[680px] rounded-full border border-border opacity-30" />

        <div className="relative mb-10 flex h-24 w-24 items-center justify-center rounded-full border border-border bg-card">
          <Stethoscope className="h-11 w-11 text-foreground/85" />
        </div>

        <h2 className="relative mb-4 max-w-[360px] text-center text-[32px] font-bold leading-[1.2] tracking-[-0.8px] text-secondary">
          Build confident teams behind every healthy smile.
        </h2>
        <p className="relative mb-12 max-w-[320px] text-center text-sm leading-[1.65] text-secondary">
          Create your account and get your clinic on one connected platform for
          appointments, records, billing, and team workflows.
        </p>
      </div>

      {/* ── Right: Form panel ── */}
      <div className="flex basis-[480px] flex-col justify-center border-l border-border bg-card px-14 py-12">
        <div className="mb-12 flex items-center gap-2.5">
          <div className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-md bg-foreground text-card">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[15px] font-semibold leading-none tracking-[-0.3px]">
              Sozo Dunamis
            </div>
            <div className="text-[11px] uppercase tracking-[0.6px] text-muted-foreground">
              ERP System
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="mb-1.5 text-[28px] font-bold tracking-[-0.6px] text-foreground">
            Create account
          </h1>
          <p className="m-0 text-sm text-muted-foreground">
            Set up your clinic workspace access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[1.1rem]">
          <div>
            <label className={labelClassName}>Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dr. Jane Doe"
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label className={labelClassName}>Role</label>
            <Combobox
              value={role}
              onValueChange={(value) => setRole(value ?? "")}
            >
              <ComboboxInput
                className="**:data-[slot=input-group]:w-full cursor-pointer **:data-[slot=input-group-input]:h-10 **:data-[slot=input-group-input]:rounded-md **:data-[slot=input-group-input]:border-input **:data-[slot=input-group-input]:bg-background **:data-[slot=input-group-input]:text-sm"
                placeholder="Select your role"
                aria-label="Role"
              />
              <ComboboxContent>
                <ComboboxEmpty>No role found.</ComboboxEmpty>
                <ComboboxList>
                  {roles.map((item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

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

          <div>
            <label className={labelClassName}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
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

          <div>
            <label className={labelClassName}>Confirm password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                required
                className={`${inputClassName} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center p-0 text-muted-foreground"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {!loading ? (
            <button
              type="submit"
              className="mt-2 h-10.5 w-full rounded-md bg-primary text-sm font-medium tracking-[0.2px] text-primary-foreground transition-opacity hover:opacity-90"
            >
              Create Sozo Dunamis account
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className={`mt-2 h-10.5 w-full rounded-md  text-sm font-medium tracking-[0.2px] text-primary-foreground transition-opacity ${loading ? "bg-secondary" : "bg-primary"} hover:opacity-90`}
            >
              Signing Up
            </button>
          )}
        </form>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-foreground no-underline">
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
}

const labelClassName =
  "mb-1.5 block text-xs font-medium tracking-[0.3px] text-muted-foreground";
const inputClassName =
  "h-10 w-full appearance-none rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20";
