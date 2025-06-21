"use client";

import React, { useEffect } from "react";
import { useLabStore } from "@/store/labStore";
import { useGetLabsQuery } from "@/redux/services/labApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const SelectLabDropdown = () => {
  const { selectedLab, setSelectedLab } = useLabStore();

  const { data: labs, isLoading } = useGetLabsQuery({});

  useEffect(() => {
    if (labs && labs.data.length > 0 && !selectedLab) {
      const firstLab = labs.data[0];
      setSelectedLab({ id: firstLab.id.toString(), name: firstLab.name });
    }
  }, [labs, selectedLab, setSelectedLab]);

  if (isLoading)
    return (
      <div className="w-full max-w-sm bg-white">
        <Select disabled>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="-- Pilih Lab --" />
          </SelectTrigger>
        </Select>
      </div>
    );

  return (
    <div className="w-full max-w-sm">
      {/* <label className="block text-sm font-medium mb-1">Pilih Lab</label> */}
      <Select
        value={selectedLab?.id.toString() || ""}
        onValueChange={(val) => {
          const lab = labs.data.find(
            (l: { id: number }) => l.id.toString() === val
          );
          if (lab) {
            setSelectedLab({ id: lab.id.toString(), name: lab.name });
          }
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="-- Pilih Lab --" />
        </SelectTrigger>
        <SelectContent>
          {labs.data.map((lab: { id: number; name: string }) => (
            <SelectItem key={lab.id} value={lab.id.toString()}>
              {lab.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectLabDropdown;
