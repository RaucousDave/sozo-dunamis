"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserPlus } from "lucide-react";

interface Patient {
    id: string
    patientCode: string
    lastName: string
    firstName: string
    dateOfBirth: string
    address: string
    phoneNumber: string
    gender: string
    createdAt: string | Date
}

// Replace with your actual db fetch
const MOCK_PATIENTS = [
  {
    id: "1",
    patientCode: "PAT-4823",
    firstName: "Emeka",
    lastName: "Okonkwo",
    phoneNumber: "08012345678",
    gender: "male",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    patientCode: "PAT-1047",
    firstName: "Ngozi",
    lastName: "Adeyemi",
    phoneNumber: "08098765432",
    gender: "female",
    createdAt: new Date("2024-02-20"),
  },
];

const DATE_FORMATTER = new Intl.DateTimeFormat("en-NG", {
  dateStyle: "medium",
  timeZone: "Africa/Lagos",
});

export default function PatientsPage() {
  // const patients = await db.select().from(patients).orderBy(desc(patients.createdAt));
  const [patients, setPatients] = useState<Patient[]>([]);
  const [error, setError] = useState<string>();

  const fetchPatients = async () => {
    const res = await fetch("/api/patients", {
      method: "GET",
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    }
    setPatients(data.patients);
  };

  useEffect(() => {
    fetchPatients()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Patients</h2>
          <p className="text-sm text-muted-foreground">
            {patients.length} patient{patients.length !== 1 ? "s" : ""}{" "}
            registered
          </p>
        </div>
        <Button render={<Link href="/patients/new" />} size="sm" className="flex">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  No patients registered yet.
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {patient.patientCode}
                  </TableCell>
                  <TableCell className="font-medium">
                    {patient.firstName} {patient.lastName}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {patient.phoneNumber}
                  </TableCell>
                  <TableCell className="text-sm capitalize text-muted-foreground">
                    {patient.gender}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {DATE_FORMATTER.format(new Date(patient.createdAt))}
                  </TableCell>
                  <TableCell>
                    <Button render={<Link href={`/patients/${patient.id}`} />} variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
