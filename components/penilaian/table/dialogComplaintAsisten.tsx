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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useUpdateStatusComplaintMutation } from "@/redux/services/complaintApi";
import { penilaianApi } from "@/redux/services/penilaian"; // Ganti dengan API slice yang sesuai
import { PenilaianType } from "@/types/penilaian";
import { AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface DialogComplaintAsistenProps {
  data: PenilaianType;
}

function DialogComplaintAsisten({ data }: DialogComplaintAsistenProps) {
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const [updateStatusComplaint, { isLoading }] = useUpdateStatusComplaintMutation();

  const onSubmit = async (status: "closed" | "rejected") => {
    try {
      await updateStatusComplaint({
        id: data.id_complaint,
        status,
      }).unwrap();

      toast.success("Berhasil", {
        description: `Komplain berhasil di${status === "closed" ? "terima" : "tolak"}`,
      });

      setOpen(false);
      dispatch(penilaianApi.util.invalidateTags(["penilaian"])); // ganti "penilaian" sesuai tag query RTK
    } catch (error) {
      toast.error("Gagal", {
        description: `Komplain gagal di${status === "closed" ? "terima" : "tolak"}`,
      });
    }
  };

  useEffect(() => {
    if (data && data.id_complaint !== null) {
      setDescription(data.komplain || "");
    }
  }, [data]);

  const getStatusConfig = () => {
    if (data.id_complaint === null) {
      return {
        bgColor: "bg-blue-500",
        text: "Tidak Ada Komplain",
        description: "Tidak ada komplain dari praktikan",
        clickable: true,
      };
    }

    if (data.status_komplain === "closed") {
      return {
        bgColor: "bg-green-500",
        text: "Diterima",
        description: "Komplain sudah ditindaklanjuti dan diselesaikan",
        clickable: true,
      };
    }

    if (data.status_komplain === "rejected") {
      return {
        bgColor: "bg-red-500",
        text: "Ditolak",
        description: "Komplain telah ditolak oleh asisten",
        clickable: true,
      };
    }

    return {
      bgColor: "bg-yellow-500",
      text: "Menunggu",
      description: "Komplain masih menunggu keputusan Anda",
      clickable: true,
    };
  };

  const statusConfig = getStatusConfig();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <AlertCircle
          className={cn(
            "w-8 h-8 p-2 text-white rounded-full cursor-pointer transition-opacity hover:opacity-80",
            statusConfig.bgColor
          )}
        />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center">Komplain Penilaian</DialogTitle>
          <DialogDescription className="text-center">
            {statusConfig.description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Status:</Label>
            <div className="col-span-3">
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium text-white",
                  statusConfig.bgColor
                )}
              >
                {statusConfig.text}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right font-medium pt-2">
              Deskripsi:
            </Label>
            <div className="col-span-3">
              <Textarea
                id="description"
                value={description}
                disabled
                placeholder="Tidak ada deskripsi komplain"
                className="min-h-[100px] resize-none bg-gray-50"
              />
              <div className="text-xs text-gray-500 mt-1">
                {description.length}/500 karakter
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          {data.status_komplain === "open" ? (
            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={() => onSubmit("rejected")}
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Loading...
                  </>
                ) : (
                  "Tolak"
                )}
              </Button>
              <Button
                onClick={() => onSubmit("closed")}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Loading...
                  </>
                ) : (
                  "Terima"
                )}
              </Button>
            </div>
          ) : (
            <Button onClick={() => setOpen(false)} className="w-full" variant="secondary">
              Tutup
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DialogComplaintAsisten;
