"use client";

import AdminUserForm from "@/components/admin/users/Forms/adminUserForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const Create = () => {
  return (
    <div className="container mx-auto p-10">
      <h1 className="text-2xl font-bold mb-4">Tambah User</h1>
      <Card className="bg-white shadow-xl">
        <CardHeader className="p-6">
          <CardTitle>Pastikan form diisi dengan benar</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <AdminUserForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Create;
