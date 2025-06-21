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
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "@/redux/services/userApi";
import { UserType } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  full_name: z.string().min(1, { message: "Nama harus diisi" }),
  nim: z.string().min(1, { message: "Nim harus diisi" }),
  email: z.string().min(1, { message: "Email harus diisi" }),
  password: z.string().min(1, { message: "Password harus diisi" }),
  role: z.string().min(1, { message: "Role harus diisi" }),
  angkatan: z.string().min(1, { message: "Angkatan harus diisi" }),
});

interface UserFormProps {
  user?: UserType | undefined;
}

const AdminUserForm = ({ user }: UserFormProps) => {
  const router = useRouter();
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [updateUser, { isLoading: isLoadingUpdate }] = useUpdateUserMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: user?.full_name || "",
      nim: user?.nim || "",
      email: user?.email || "",
      password: user?.password || "",
      role: user?.role || "",
      angkatan: user?.angkatan.toString() || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (user) {
        const updatedValues = {
          ...values,
          id: user.id_user, // Pastikan user.id ada
        };
        await updateUser (updatedValues).unwrap();
      } else {
        await createUser(values).unwrap();
      }

      toast.success("Berhasil", {
        description: `User berhasil ${user ? "diperbarui" : "ditambahkan"}`,
      });

      router.push("/admin/users");
      form.reset();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("🚀 ~ onSubmit ~ error:", error);

      toast.error("Gagal", {
        description: error?.data?.message || "User gagal ditambahkan",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama</FormLabel>
                <FormControl>
                  <Input placeholder="Nama" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nim"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nim</FormLabel>
                <FormControl>
                  <Input placeholder="NIM" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="****@students.undip.ac.id"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!user && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="*********"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="praktikan">Praktikan</SelectItem>
                    <SelectItem value="asisten">Asisten</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="angkatan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Angkatan</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value.toString())}
                  value={field.value.toString()}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Tahun Angkatan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 7 }, (_, i) => (
                      <SelectItem
                        key={i}
                        value={(new Date().getFullYear() - i).toString()}
                      >
                        {(new Date().getFullYear() - i).toString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
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

export default AdminUserForm;
