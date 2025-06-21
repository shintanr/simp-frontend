"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { getSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function FormLogin() {
  const [role, setRole] = useState<"praktikan" | "asisten">("praktikan");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const formSchema = z.object({
    email: z
      .string({
        required_error: "Email wajib diisi",
      })
      .nonempty("Email tidak boleh kosong"),
    password: z
      .string({
        required_error: "Password wajib diisi",
      })
      .min(6, "Password minimal 6 karakter"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const finalValues = {
      ...values,
      role,
    };

    const res = await signIn("credentials", {
      ...finalValues,
      redirect: false,
    });

    if (res && res.ok && res.error === null) {
      form.reset();
      toast.success("Login berhasil", {
        description: "Selamat datang di Sistem Informasi Manajemen Praktikum",
      });
      const session = await getSession();

      if (session?.user?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } else {
      if (res?.error) {
        try {
          const errorData = JSON.parse(res.error); // Parse error JSON dari backend

          toast.error("Login gagal", {
            description: errorData.message,
          });
        } catch {
          toast.error("Login gagal", {
            description: "Terjadi kesalahan pada server",
          });
        }
      } else {
        toast.error("Login gagal", {
          description: "Terjadi kesalahan pada server",
        });
      }
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <Tabs
        defaultValue="praktikan"
        className="w-full"
        onValueChange={(val) => setRole(val as "praktikan" | "asisten")}
      >
        <TabsList className="w-full shadow-xl bg-[#0267FE] h-12 py-2 px-5">
          <TabsTrigger
            value="praktikan"
            className="data-[state=active]:shadow data-[state=active]:bg-[#74ABFF] text-white font-bold"
          >
            Praktikan
          </TabsTrigger>
          <TabsTrigger
            value="asisten"
            className="data-[state=active]:shadow data-[state=active]:bg-[#74ABFF] text-white font-bold"
          >
            Asisten
          </TabsTrigger>
        </TabsList>

        <TabsContent value="praktikan" className="my-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="praktikan@students.undip.ac.id" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="********"
                          {...field}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                variant={"default"}
                size={"lg"}
                className="w-full font-bold"
              >
                Log In
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="asisten" className="my-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="asisten@students.undip.ac.id" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="********"
                          {...field}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                variant={"default"}
                size={"lg"}
                className="w-full font-bold"
              >
                Log In
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
