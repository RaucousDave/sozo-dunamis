import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import type { FormState } from "@/app/(dashboard)/patients/new/page";

type FormProps = {
  form: FormState;
  loading: boolean;
  handleChange: (field: keyof FormState, value: string) => void;
  handleSubmit: () => void;
};
export default function PatientForm({
  form,

  loading,
  handleChange,
  handleSubmit,
}: FormProps) {
  const router = useRouter();
  return (
    <div className="space-y-6 py-4">
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
