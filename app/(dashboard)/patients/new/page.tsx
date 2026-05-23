"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PatientForm from "@/components/shared/PatientForm";
import { toast } from "sonner";
export interface FormState {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        toast.error(data.error);
        return;
      }

      console.log("POST: [/api/patients/new] ", data.message);
      toast.success(data.message);
      setForm(INITIAL_STATE);
      router.refresh();
      router.push("/patients");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PatientForm
      form={form}
      loading={loading}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
}
