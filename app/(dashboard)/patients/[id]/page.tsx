"use client";

import type { InputHTMLAttributes } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  Trash,
  MapPin,
  Pencil,
  Phone,
  Save,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
type Gender = "male" | "female";

interface PatientRecord {
  id: string;
  patientCode: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  phoneNumber: string;
  email: string;
  address: string;
  registeredBy: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface PatientResponse {
  message?: string;
  error?: string;
  patient?: PatientRecord;
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en-NG", {
  dateStyle: "medium",
  timeZone: "Africa/Lagos",
});

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return DATE_FORMATTER.format(date);
}

function calculateAge(dateOfBirth: string) {
  const birthDate = new Date(dateOfBirth);
  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age;
}

function toTitleCase(value: string) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function PatientField({
  id,
  label,
  value,
  isEditing,
  onChange,
  type = "text",
}: {
  id: keyof PatientRecord;
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (field: keyof PatientRecord, value: string) => void;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
}) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={String(id)}
        className="text-xs uppercase tracking-wide text-muted-foreground"
      >
        {label}
      </Label>
      {isEditing ? (
        <Input
          id={String(id)}
          type={type}
          value={value}
          onChange={(event) => onChange(id, event.target.value)}
        />
      ) : (
        <div className="min-h-10 rounded-md border bg-muted/30 px-3 py-2 text-sm text-foreground">
          {value || "N/A"}
        </div>
      )}
    </div>
  );
}

export default function PatientDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const patientId = typeof params?.id === "string" ? params.id : "";
  console.log("Raw Params: ", params);
  const missingPatientId = !patientId;

  const [patient, setPatient] = useState<PatientRecord | null>(null);
  const [draft, setDraft] = useState<PatientRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const deletePatient = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/patients/${patientId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast.error("");
        throw new Error("Failed to delete patient");
      }
      router.push("/patients");
    } catch (error) {
      console.error("Something went wrong: ", error);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!patientId) return;

    console.log("Patient Id: ", patientId);

    let isMounted = true;

    async function loadPatient() {
      setLoading(true);
      setFetchError(null);

      try {
        console.log("Fetching patient data....");
        const response = await fetch(`/api/patients/${patientId}`, {
          method: "GET",
          cache: "no-store",
        });

        console.log("Fetch response: ", response);
        const data: PatientResponse = await response.json();

        if (!response.ok || !data.patient) {
          throw new Error(data.error || "Failed to fetch patient.");
        }

        if (!isMounted) return;

        setPatient(data.patient);
        setDraft(data.patient);
      } catch (error) {
        if (!isMounted) return;

        const message =
          error instanceof Error ? error.message : "Failed to fetch patient.";
        setFetchError(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPatient();

    return () => {
      isMounted = false;
    };
  }, [patientId]);

  const age = patient?.dateOfBirth ? calculateAge(patient.dateOfBirth) : null;

  function handleDraftChange(field: keyof PatientRecord, value: string) {
    setDraft((current) => (current ? { ...current, [field]: value } : current));
  }

  function handleCancel() {
    setDraft(patient);
    setIsEditing(false);
  }

  async function handleSave() {
    if (!draft || !patientId) return;

    setIsSaving(true);

    try {
      const response = await fetch(`/api/patients/${patientId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: draft.firstName,
          lastName: draft.lastName,
          dateOfBirth: draft.dateOfBirth,
          gender: draft.gender,
          phoneNumber: draft.phoneNumber,
          email: draft.email,
          address: draft.address,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Unable to save patient changes.");
      }

      const nextPatient = data?.patient ?? draft;
      setPatient(nextPatient);
      setDraft(nextPatient);
      setIsEditing(false);
      toast.success(data?.message || "Patient updated successfully.");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to save patient changes.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-56 animate-pulse rounded bg-muted" />
        </div>
        <div className="rounded-md border border-border p-6">
          <div className="h-48 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (missingPatientId || fetchError || !patient || !draft) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          render={<Link href="/patients" />}
          nativeButton={false}
          className="w-fit px-0"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to patients
        </Button>
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-6">
          <h1 className="text-lg font-semibold text-foreground">
            Patient not available
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {missingPatientId
              ? "Patient ID is missing."
              : fetchError ||
                "The requested patient record could not be loaded."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Button
            variant="ghost"
            render={<Link href="/patients" />}
            nativeButton={false}
            className="w-fit px-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to patients
          </Button>

          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-lg font-semibold text-primary">
              {patient.firstName.charAt(0)}
              {patient.lastName.charAt(0)}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">
                  {patient.firstName} {patient.lastName}
                </h1>
                <Badge variant="outline" className="font-mono text-xs">
                  {patient.patientCode}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {toTitleCase(patient.gender)}
                  {age !== null ? `, ${age} years` : ""}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-4 w-4" />
                  {patient.phoneNumber}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  {patient.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit patient
              </Button>

              <AlertDialog>
                <AlertDialogTrigger>
                  <Button className="bg-red-700 text-white" variant="outline">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete patient
                  </Button>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this patient's data
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-gray-100 text-red-500 hover:bg-red-600 hover:text-white transition ease-linear duration-300"
                        onClick={deletePatient}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogTrigger>
              </AlertDialog>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_320px]">
        <div className="space-y-6 rounded-md border border-border bg-card p-6">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Patient details
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Review and update the core patient record fields returned by the
              current API route.
            </p>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <PatientField
              id="firstName"
              label="First name"
              value={draft.firstName}
              isEditing={isEditing}
              onChange={handleDraftChange}
            />
            <PatientField
              id="lastName"
              label="Last name"
              value={draft.lastName}
              isEditing={isEditing}
              onChange={handleDraftChange}
            />
            <PatientField
              id="dateOfBirth"
              label="Date of birth"
              value={draft.dateOfBirth}
              isEditing={isEditing}
              onChange={handleDraftChange}
              type="date"
            />

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Gender
              </Label>
              {isEditing ? (
                <Select
                  value={draft.gender}
                  onValueChange={(value: Gender | null) =>
                    handleDraftChange("gender", value as Gender)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="min-h-10 rounded-md border bg-muted/30 px-3 py-2 text-sm text-foreground">
                  {toTitleCase(patient.gender)}
                </div>
              )}
            </div>

            <PatientField
              id="phoneNumber"
              label="Phone number"
              value={draft.phoneNumber}
              isEditing={isEditing}
              onChange={handleDraftChange}
              type="tel"
            />
            <PatientField
              id="email"
              label="Email"
              value={draft.email}
              isEditing={isEditing}
              onChange={handleDraftChange}
              type="email"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Address
            </Label>
            {isEditing ? (
              <Input
                value={draft.address}
                onChange={(event) =>
                  handleDraftChange("address", event.target.value)
                }
              />
            ) : (
              <div className="min-h-10 rounded-md border bg-muted/30 px-3 py-2 text-sm text-foreground">
                {patient.address}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-md border border-border bg-card p-6">
            <h2 className="text-sm font-semibold text-foreground">
              Record summary
            </h2>
            <div className="mt-4 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Date of birth</p>
                  <p className="font-medium text-foreground">
                    {formatDate(patient.dateOfBirth)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Address</p>
                  <p className="font-medium text-foreground">
                    {patient.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium text-foreground">
                    {formatDate(patient.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Last updated</p>
                  <p className="font-medium text-foreground">
                    {formatDate(patient.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-border bg-card p-6">
            <h2 className="text-sm font-semibold text-foreground">
              Integration notes
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Save submits a `PATCH` request to{" "}
              <code>/api/patients/{patient.id}</code> with the editable patient
              fields. Once you add that handler server-side, this screen should
              work without more client changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
