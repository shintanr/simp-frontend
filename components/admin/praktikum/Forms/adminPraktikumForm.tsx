"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreatePraktikumMutation, useUpdatePraktikumMutation } from "@/redux/services/praktikumApi";
import { LabType } from "@/types/lab";
import { Praktikum } from "@/types/praktikum";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  lab_id: z.number().min(1, { message: "Lab wajib diisi" }),
  name: z.string().min(1, { message: "Nama praktikum wajib diisi" }),
  code: z.string().min(1, { message: "Kode praktikum wajib diisi" }),
  modul: z.string().min(1, { message: "Modul wajib diisi" }),
  modules: z.array(
    z.object({
      judul_modul: z.string().min(1, { message: "Judul modul wajib diisi" }),
      deskripsi: z.string().min(1, { message: "Deskripsi wajib diisi" }),
      file_modul: z.string().min(1, { message: "File modul wajib diisi" }),
    })
  ),
});

interface PraktikumFormProps {
  labs: LabType[];
  data?: Praktikum | undefined;
}

const AdminPraktikumForm = ({ data, labs }: PraktikumFormProps) => {
  const router = useRouter();
  const [createPraktikum, { isLoading }] = useCreatePraktikumMutation();
  const [updatePraktikum, { isLoading: isLoadingUpdate }] = useUpdatePraktikumMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lab_id: data?.lab_id || undefined,
      name: data?.name || "",
      code: data?.code || "",
      modul: data?.modul || "",
      modules: data?.modules || [
        {
          judul_modul: "",
          deskripsi: "",
          file_modul: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "modules",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("🚀 ~ onSubmit ~ values:", values);
    try {
      if (data) {
        const updatedValues = {
          ...values,
          id: data.id_praktikum,
        };
        await updatePraktikum(updatedValues).unwrap();
      } else {
        await createPraktikum(values).unwrap();
      }

      toast.success("Berhasil", {
        description: `Praktikum berhasil ${
          data ? "diperbarui" : "ditambahkan"
        }`,
      });

      router.push("/admin/praktikum");
      form.reset();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("🚀 ~ onSubmit ~ error:", error);

      toast.error("Gagal", {
        description: error?.data?.message || "Praktikum gagal ditambahkan",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Praktikum</FormLabel>
                <FormControl>
                  <Input placeholder="Nama Praktikum" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lab_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lab</FormLabel>
                {labs && labs.length > 0 && (
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? field.value.toString() : undefined}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Lab" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {labs.map((lab) => (
                        <SelectItem key={lab.id} value={lab.id.toString()}>
                          {lab.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code Praktikum</FormLabel>
                <FormControl>
                  <Input placeholder="Code Praktikum" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="modul"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Module Praktikum</FormLabel>
                <FormControl>
                  <Input placeholder="Module Praktikum" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <h1 className="text-2xl font-bold">Modules</h1>
          <div className="col-span-1 md:col-span-2">
            {fields.map((module, index) => (
              <div
                key={module.id}
                className="mb-4 flex justify-between items-end"
              >
                <div className="flex items-center gap-4 w-full px-2">
                  <FormField
                    control={form.control}
                    name={`modules.${index}.judul_modul`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Judul Modul</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Masukkan Judul Modul"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`modules.${index}.deskripsi`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Deskripsi</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Masukkan Deskripsi" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`modules.${index}.file_modul`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>File Modul</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Masukkan URL atau Path File Modul"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="button"
                  variant={"destructive"}
                  onClick={() => remove(index)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() =>
                append({
                  judul_modul: "",
                  deskripsi: "",
                  file_modul: "tidak ada",
                })
              }
            >
              Tambah Modul
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <Button type="submit" className={"mt-4"} disabled={isLoading}>
            {isLoading || isLoadingUpdate ? (
              <div className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              "Simpan"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AdminPraktikumForm;
