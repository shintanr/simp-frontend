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
import { useCreateComplaintMutation } from "@/redux/services/complaintApi";
import { PenilaianType } from "@/types/penilaian";
import { AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface DialogComplaintPraktikanProps {
  data: PenilaianType;
}

function DialogComplaintPraktikan({ data }: DialogComplaintPraktikanProps) {
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);

  const [createComplaint, { isLoading }] = useCreateComplaintMutation();

  const onOpenModal = () => {
    if (data && data.id === null) return;
    setOpen(!open);
  };

  const onSubmit = async () => {
    try {
      await createComplaint({
        reference_type: "penilaian",
        reference_id: data.id,
        description,
        status: "open",
      }).unwrap();

      toast.success("Berhasil", {
        description: "Komplain berhasil dikirim",
      });
      setOpen(false);
      setDescription("");
    } catch (error) {
      console.log(error);
      toast.error("Gagal", {
        description: "Komplain gagal dikirim",
      });
      setOpen(true);
    }
  };

  useEffect(() => {
    if (data && data.id_complaint !== null) {
      setDescription(data.komplain || "");
    }
  }, [data]);

  const getStatusConfig = () => {
    if (data.id === null) {
      return {
        bgColor: "bg-gray-500",
        text: "Belum Ada Nilai",
        clickable: false,
      };
    }

    if (data.komplain && data.status_komplain === "closed") {
      return {
        bgColor: "bg-green-500",
        text: "Komplain Selesai",
        clickable: true,
      };
    }

    if (data.komplain && data.status_komplain === "rejected") {
      return {
        bgColor: "bg-red-500",
        text: "Komplain Ditolak",
        clickable: true,
      };
    }

    if (data.komplain && data.komplain.trim() !== "") {
      return {
        bgColor: "bg-yellow-500",
        text: "Komplain Terkirim",
        clickable: true,
      };
    }

    return {
      bgColor: "bg-blue-500",
      text: "Bisa Komplain",
      clickable: true,
    };
  };

  const statusConfig = getStatusConfig();

  return (
    <Dialog open={open} onOpenChange={onOpenModal}>
      <DialogTrigger asChild>
        <button
          className={cn(
            "flex items-center justify-center gap-2 text-white text-sm font-medium rounded-full px-4 py-2",
            statusConfig.bgColor,
            statusConfig.clickable ? "cursor-pointer hover:opacity-80" : "opacity-50 cursor-not-allowed"
          )}
          disabled={!statusConfig.clickable}
        >
          <AlertCircle className="w-4 h-4" />
          <span className="whitespace-nowrap">{statusConfig.text}</span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center">Komplain Penilaian</DialogTitle>
          <DialogDescription className="text-center">
            {data.status_komplain === "closed"
              ? "Detail komplain yang sudah diselesaikan"
              : data.status_komplain === "rejected"
              ? "Detail komplain yang ditolak"
              : "Masukkan alasan komplain Anda dan sertakan bukti pendukung berupa tautan Google Drive."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Status:</Label>
            <div className="col-span-3">
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  statusConfig.bgColor,
                  "text-white"
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
                onChange={(e) => setDescription(e.target.value)}
                disabled={data.status_komplain === "closed" || data.status_komplain === "rejected"}
                placeholder={
                  data.status_komplain === "closed"
                    ? "Komplain sudah ditutup oleh admin"
                    : data.status_komplain === "rejected"
                    ? "Komplain sudah ditolak oleh admin"
                    : "Tuliskan alasan komplain Anda di sini..."
                }
                className={cn(
                  "min-h-[100px] resize-none",
                  (data.status_komplain === "closed" || data.status_komplain === "rejected") &&
                    "bg-gray-50"
                )}
                maxLength={500}
              />
              <div className="text-xs text-gray-500 mt-1">{description.length}/500 karakter</div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {data.status_komplain !== "closed" && data.status_komplain !== "rejected" ? (
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button
                onClick={onSubmit}
                className="flex-1"
                disabled={isLoading || !description.trim()}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Mengirim...</span>
                  </div>
                ) : (
                  "Kirim Komplain"
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

export default DialogComplaintPraktikan;
