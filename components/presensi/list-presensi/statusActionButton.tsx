"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreatePresensiPraktikumMutation } from "@/redux/services/presensiApi";
import { ListPresensiType } from "@/types/presensi";
import React from "react";
import { toast } from "sonner";

interface statusActionButtonProps {
  data: ListPresensiType;
  selectedModul: string
}
function StatusActionButton({ data, selectedModul }: statusActionButtonProps) {
  const [statusPresensi, setStatusPresensi] = React.useState(data.status || "");
  const status = data.status;
  let statusColorClass = "" 
  if (status === "Hadir") {
    statusColorClass = "bg-green-500 text-white rounded-full w-1/2";
  } else if (status === "Telat"){
    statusColorClass = "bg-yellow-500 text-white rounded-full w-1/2";
  } else if (status === "Izin") {
    statusColorClass = "bg-blue-500 text-white rounded-full w-1/2";
  } else if (status === "Alpha") {
    statusColorClass = "bg-red-500 text-white rounded-full w-1/2";
  } else {
    statusColorClass = "bg-gray-500 text-white rounded-full w-1/2";
  }

  const [createPresensi, { isLoading }] = useCreatePresensiPraktikumMutation();

  const onSubmit = async () => {
    try {
      await createPresensi({
        id_user: data.id_user,
        id_praktikum: data.id_praktikum,
        id_modul: selectedModul,
        id_shift: data.id_shift,
        status: statusPresensi,
      });

      toast.success("Status berhasil diperbarui");
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error)
      toast.error("Status gagal diperbarui");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className={statusColorClass + " flex items-center justify-center cursor-pointer p-1"}>
          <h1>{data.status || "Belum Hadir"}</h1>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Update Status</DialogTitle>
          <DialogDescription>
            <Select value={statusPresensi} onValueChange={setStatusPresensi}>
              <SelectTrigger className="w-full my-2">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Belum Hadir">Belum Hadir</SelectItem>
                <SelectItem value="Hadir">Hadir</SelectItem>
                <SelectItem value="Telat">Telat</SelectItem>
                <SelectItem value="Izin">Izin</SelectItem>
                <SelectItem value="Alpha">Alpha</SelectItem>
              </SelectContent>
            </Select>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button className="w-full" onClick={onSubmit}>{isLoading ? "Loading..." : "Submit" }</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default StatusActionButton;
