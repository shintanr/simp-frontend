/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Plus } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  useCreateuserPraktikumMutation,
  useInquiryPraktikumMutation,
} from "@/redux/services/userPraktikum";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const codeOnlySchema = z.object({
  code: z.string().min(2, "Kode praktikum wajib diisi"),
});

const fullFormSchema = codeOnlySchema.extend({
  shift: z.string().min(1, "Shift wajib dipilih"),
  asisten: z.boolean().optional(),
});

function FormModalAddPracticum() {
  const [codeFound, setCodeFound] = useState(false);
  const [praktikumId, setPraktikumId] = useState("");
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  
  // Check if user has asisten role
  const hasAsistenRole = useMemo(() => {
    if (!session?.user?.role) return false;
    return session.user.role === "asisten" || session.user.role === "admin";
  }, [session]);

  const [inquiryPraktikum, { isLoading }] = useInquiryPraktikumMutation();

  const [createUserPraktikum, { isLoading: isLoadingCreate }] =
    useCreateuserPraktikumMutation();

  const schema = useMemo(
    () => (codeFound ? fullFormSchema : codeOnlySchema),
    [codeFound]
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof fullFormSchema>>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      code: "",
      shift: "",
      asisten: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof fullFormSchema>) => {
    if (!codeFound) {
      try {
        // Melakukan mutation inquiryPraktikum dan menunggu hasilnya
        const result = await inquiryPraktikum({ code: values.code }).unwrap();

        // Mengecek apakah data ditemukan, jika berhasil set codeFound true
        if (result) {
          setPraktikumId(result.data.id_praktikum);
          setCodeFound(true); // Set codeFound menjadi true jika inquiry berhasil
          toast.success("Praktikum ditemukan!", {
            description: "Praktikum berhasil ditemukan.",
          });
        }
      } catch (err: any) {
        console.log("🚀 ~ onSubmit ~ err:", err);
        toast.error("Gagal", {
          description: err?.data?.message || "Praktikum tidak ditemukan",
        });
      }
    } else {
      console.log("Final submit:", values);
      const isAsisten = hasAsistenRole && values.asisten ? 1 : 0;
      try {
        await createUserPraktikum({
          id_praktikum: praktikumId,
          id_shift: values.shift,
          is_asisten: isAsisten,
        }).unwrap();

        toast.success("Praktikum berhasil ditambahkan!", {
          description: "Praktikum berhasil ditambahkan.",
        });
        setCodeFound(false);
        setOpen(false);
        reset();
      } catch (error) {
        console.log("🚀 ~ onSubmit ~ error:", error);
        toast.error("Gagal", {
          description: "Praktikum gagal ditambahkan",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button asChild className="cursor-pointer">
          <Card className="bg-white min-h-[200px] h-full flex items-center justify-center border-dashed transition duration-300 ease-in-out border-2 border-[#0267FE] hover:border-white hover:bg-primary/90 hover:text-white text-primary">
            <CardContent className="flex flex-col items-center gap-2">
              <Plus />
              <h2 className="text-lg font-bold mb-2 text-center">
                Tambah Praktikum
              </h2>
            </CardContent>
          </Card>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Praktikum</DialogTitle>
          <DialogDescription>
            {codeFound
              ? "Lengkapi data praktikum."
              : "Masukkan kode praktikum terlebih dahulu."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">
              Code
            </Label>
            <Input
              id="code"
              {...register("code")}
              className="col-span-3"
              disabled={codeFound}
            />
            {errors.code && (
              <p className="text-sm text-red-500 col-span-4 ml-[34%] -mt-2">
                {errors.code.message}
              </p>
            )}
          </div>

          {codeFound && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="shift" className="text-right">
                  Shift
                </Label>
                <Select
                  onValueChange={(value) => setValue("shift", value)}
                  defaultValue=""
                >
                  <SelectTrigger className="col-span-3 w-full">
                    <SelectValue placeholder="Pilih shift" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 4 }, (_, i) => i + 1).map((shift) => (
                      <SelectItem key={shift} value={shift.toString()}>
                        Shift {shift}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.shift && (
                  <p className="text-sm text-red-500 col-span-3 ml-[34%] -mt-2">
                    {errors.shift.message}
                  </p>
                )}
              </div>

              {/* Only show checkbox if user has asisten role */}
              {hasAsistenRole && (
                <div className="flex gap-2 items-center">
                  <Label htmlFor="asisten" className="">
                    Sebagai Asisten
                  </Label>
                  <Checkbox
                    id="asisten"
                    checked={watch("asisten")}
                    onCheckedChange={(checked) => setValue("asisten", !!checked)}
                    className="col-span-3"
                  />
                </div>
              )}
            </>
          )}

          <DialogFooter>
            <Button type="submit">
              {isLoading || isLoadingCreate
                ? "Loading..."
                : codeFound
                ? "Simpan Praktikum"
                : "Cek Kode"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default FormModalAddPracticum;