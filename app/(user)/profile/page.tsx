"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdatePasswordMutation } from "@/redux/services/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z
  .object({
    oldPassword: z.string().min(6, "Password minimal 6 karakter"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string().min(6, "Password minimal 6 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // Menunjukkan error pada field confirmPassword
    message: "Konfirmasi password tidak cocok",
  });

export default function ProfilePage() {
  const session = useSession();
  const [open, setOpen] = React.useState(false);
  const [showPasswordOld, setShowPasswordOld] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const params = {
        newPassword: values.password,
        oldPassword: values.oldPassword,
        email: session?.data?.user?.email,
      };
      await updatePassword(params).unwrap();

      toast.success("Password berhasil diperbarui");

      form.reset();
      setOpen(false);
      signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error);

      toast.error("Password gagal diperbarui");
    }
  }

  return (
    <Card className="max-w-4xl mx-auto mt-10 p-12 bg-white shadow-md rounded-xl border-0 border-black">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Profil Pengguna
      </h1>
      <div className="space-y-2">
        <div className="flex justify-center w-full p-4">
          <Image
            src={"/profile-dummy.png"}
            alt="Profile"
            width={200}
            height={200}
          />
        </div>
        <div className="grid grid-cols-4 border-b-2 border-black pb-4">
          <h1 className="font-semibold col-span-1">Nama</h1>
          <h1 className="col-span-3">: {session?.data?.user?.name}</h1>
        </div>
        <div className="grid grid-cols-4 border-b-2 border-black pb-4">
          <h1 className="font-semibold col-span-1">Email</h1>
          <h1 className="col-span-3">: {session?.data?.user?.email}</h1>
        </div>
        <div className="grid grid-cols-4 border-b-2 border-black pb-4">
          <h1 className="font-semibold col-span-1">NIM</h1>
          <h1 className="col-span-3">: {session?.data?.user?.nim}</h1>
        </div>
        <div className="grid grid-cols-4 border-b-2 border-black pb-4">
          <h1 className="font-semibold col-span-1">Angkatan</h1>
          <h1 className="col-span-3">: {session?.data?.user?.angkatan}</h1>
        </div>
        <div className="grid grid-cols-4 border-b-2 border-black pb-4">
          <h1 className="font-semibold col-span-1">Role</h1>
          <h1 className="col-span-3">: {session?.data?.user?.role}</h1>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div className="flex w-full justify-center mt-4">
              <Button variant={"destructive"}>Ubah Password</Button>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ingin mengubah password?</DialogTitle>
              <DialogDescription>
                Pastikan form diisi dengan benar
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password Lama</FormLabel>
                      <div className="relative">
                        <Input
                          className="w-full p-2 rounded-lg"
                          type={showPasswordOld ? "text" : "password"}
                          placeholder="Password"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowPasswordOld(!showPasswordOld)}
                        >
                          {showPasswordOld ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <Input
                          className="w-full p-2 rounded-lg"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Konfirmasi Password</FormLabel>
                      <div className="relative">
                        <Input
                          className="w-full p-2 rounded-lg"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Password"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <div className="flex justify-center w-full">
                    <Button type="submit" disabled={isLoading} className="mt-4">
                      {isLoading ? "Loading..." : "Ubah Password"}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}
