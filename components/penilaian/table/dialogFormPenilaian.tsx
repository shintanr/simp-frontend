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
import { Input } from "@/components/ui/input";
import { useCreatePenilaianPraktikumMutation } from "@/redux/services/penilaian";
import { PenilaianType } from "@/types/penilaian";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardList } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  nilai_tp: z.string().optional(),
  nilai_fd: z.string().optional(),
  nilai_praktikum: z.string().optional(),
  nilai_laporan_tugas: z.string().optional(),
  nilai_responsi: z.string().optional(),
});

interface dialogFormPenilaianProps {
  data: PenilaianType;
  selectedModul: string;
}
function DialogFormPenilaian({
  data,
  selectedModul,
}: dialogFormPenilaianProps) {
  const [open, setOpen] = useState(false);
  const [createPenilaian, { isLoading }] =
    useCreatePenilaianPraktikumMutation();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      nilai_tp: "0",
      nilai_fd: "0",
      nilai_praktikum: "0",
      nilai_laporan_tugas: "0",
      nilai_responsi: "0",
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    console.log("🚀 ~ onSubmit ~ values:", values);
    try {
      await createPenilaian({
        id_user: data.id_user,
        id_praktikum: data.id_praktikum,
        id_modul: selectedModul,
        id_shift: data.id_shift,
        ...values,
      });

      toast.success("Penilaian berhasil diperbarui");
      setOpen(false);
      reset();
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error);
      toast.error("Penilaian gagal diperbarui");
    }
  };

  useEffect(() => {
    if (data && open) {
      reset({
        nilai_tp: data.nilai_tp?.toString() || "0",
        nilai_fd: data.nilai_fd?.toString() || "0",
        nilai_praktikum: data.nilai_praktikum?.toString() || "0",
        nilai_laporan_tugas: data.nilai_laporan_tugas?.toString() || "0",
        nilai_responsi: data.nilai_responsi?.toString() || "0",
      });
    }
  }, [data, open, reset]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer bg-[#0267FE] shadow-md p-2 rounded-2xl text-white transition duration-300 ease-in-out hover:bg-[#0267FE]/80 hover:scale-105">
          <ClipboardList className="w-6 h-6 cursor-pointer" />
          <span className="font-medium">Penilaian</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Penilaian</DialogTitle>
          <DialogDescription className="text-center">
            Pastikan nilai yang diinputkan benar
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control flex flex-col w-full">
              <label className="label">
                <span className="label-text">Nilai TP</span>
              </label>
              <Input
                {...register("nilai_tp")}
                type="number"
                className="input input-bordered"
              />
            </div>
            <div className="form-control flex flex-col w-full">
              <label className="label">
                <span className="label-text">Nilai FD</span>
              </label>
              <Input
                {...register("nilai_fd")}
                type="number"
                className="input input-bordered"
              />
            </div>
            <div className="form-control flex flex-col w-full">
              <label className="label">
                <span className="label-text">Nilai Praktikum</span>
              </label>
              <Input
                {...register("nilai_praktikum")}
                type="number"
                className="input input-bordered"
              />
            </div>
            <div className="form-control flex flex-col w-full">
              <label className="label">
                <span className="label-text">Nilai Laporan Tugas</span>
              </label>
              <Input
                {...register("nilai_laporan_tugas")}
                type="number"
                className="input input-bordered"
              />
            </div>
            <div className="form-control flex flex-col w-full">
              <label className="label">
                <span className="label-text">Nilai Responsi</span>
              </label>
              <Input
                {...register("nilai_responsi")}
                type="number"
                className="input input-bordered"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit" className="w-full">
              {isLoading ? "Loading..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default DialogFormPenilaian;
