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
import { Input } from "@/components/ui/input";

interface Patient {
  id: string;
  patientCode: string;
  lastName: string;
  firstName: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  gender: string;
  createdAt: string | Date;
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en-NG", {
  dateStyle: "medium",
  timeZone: "Africa/Lagos",
});

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchedName, setSearchedName] = useState<string>("");
  const [error, setError] = useState<string>();

  const filteredPatients = patients.filter((patient) => {
    const query = searchedName.toLowerCase();

    if (!query) return true;

    return(
      patient.lastName.includes(query) ||
      patient.firstName.includes(query)
    )
  });
  const handleSearchPatients = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchedName(e.target.value);
    console.log("Filtered patients: ", filteredPatients)
  };

  const handleSearch = (name: string) => {
    const patientMatch = patients.filter((patient) => {
      return patient.lastName === name || patient.firstName === name;
    });
    console.log(patientMatch);
    setSearchedName("");
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/patients", {
          method: "GET",
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error);
        }
        setPatients(data.patients);
      } catch (error) {
        console.error("Something went wrong: ", error);
      }
    };

    fetchData();
  }, [error]);

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
        <Button
          render={<Link href="/patients/new" />}
          nativeButton={false}
          size="default"
          className="flex"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </div>

      <div className="w-full my-6 space-x-4">
        <Input
          className="px-6 py-1 w-9/10 rounded-full"
          onChange={handleSearchPatients}
          value={searchedName}
          placeholder="Enter patient name"
        />
        <Button
          onClick={() => {
            handleSearch(searchedName);
          }}
          size="default"
          variant="outline"
          className="px-4 "
        >
          Search
        </Button>
      </div>
      <div className="rounded-md pt-2 border border-border">
        <Table>
          <TableHeader>
            <TableRow>
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
              filteredPatients.map((patient) => (
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
                    <Button
                      variant="ghost"
                      render={<Link href={`/patients/${patient.id}`} />}
                      nativeButton={false}
                      size="sm"
                    >
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
