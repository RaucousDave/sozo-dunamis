"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {toast} from "sonner"
interface FormState {
  // Patient
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;
  address: string;
  // Next of kin
  nokName: string;
  nokPhone: string;
}

const INITIAL_STATE: FormState = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  phoneNumber: "",
  email: "",
  address: "",
  nokName: "",
  nokPhone: "",
};

export default function NewPatientPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      const res = await fetch("/api/patients/new", {
        method: "POST",
        credentials: "include",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        toast.error(data.error)
        return
      }

      toast.success(data.message)
      setForm(INITIAL_STATE);
      router.refresh()
      router.push("/patients");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Register Patient</h2>
        <p className="text-sm text-muted-foreground">
          Fill in the patient&apos;s details below.
        </p>
      </div>

      <div className="rounded-md border border-border p-6 space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Personal Information
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Emeka"
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Okonkwo"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={form.gender}
                onValueChange={(value) =>
                  handleChange("gender", value as string)
                }
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Contact Information */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Contact Information
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                placeholder="08012345678"
                value={form.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="emeka@example.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="12 Aba Road, Port Harcourt"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Next of Kin */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Next of Kin
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="nokName">Full Name</Label>
              <Input
                id="nokName"
                placeholder="Adaeze Okonkwo"
                value={form.nokName}
                onChange={(e) => handleChange("nokName", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nokPhone">Phone Number</Label>
              <Input
                id="nokPhone"
                placeholder="08087654321"
                value={form.nokPhone}
                onChange={(e) => handleChange("nokPhone", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Registering..." : "Register Patient"}
        </Button>
        <Button
          variant="ghost"
          onClick={() => router.push("/patients")}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
