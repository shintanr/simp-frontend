"use client";

import AdminPraktikumForm from "@/components/admin/praktikum/Forms/adminPraktikumForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetLabsQuery } from "@/redux/services/labApi";
import React from "react";

const Create = () => {
  const { data: labs, error, isLoading } = useGetLabsQuery({});

  if (isLoading || error) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-2xl font-bold mb-4">Tambah Praktikum</h1>
      <Card className="bg-white shadow-xl">
        <CardHeader className="p-6">
          <CardTitle>Pastikan form diisi dengan benar</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <AdminPraktikumForm labs={labs.data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Create;
