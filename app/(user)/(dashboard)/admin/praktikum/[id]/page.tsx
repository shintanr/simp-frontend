"use client";

import AdminPraktikumForm from "@/components/admin/praktikum/Forms/adminPraktikumForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetLabsQuery } from "@/redux/services/labApi";
import { useDetailPraktikumQuery } from "@/redux/services/praktikumApi";
import { useParams } from "next/navigation";
import React from "react";

const Detail = () => {
  const { id } = useParams();
  const { data: labs, error, isLoading } = useGetLabsQuery({});
  const { data: praktikum, isLoading: isLoadingPraktikum, error: errorPraktikum } = useDetailPraktikumQuery(id, {
    skip: !id,
  })

  if (isLoading || error || isLoadingPraktikum || errorPraktikum) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-2xl font-bold mb-4">Ubah Praktikum</h1>
      <Card className="bg-white shadow-xl">
        <CardHeader className="p-6">
          <CardTitle>Pastikan form diisi dengan benar</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <AdminPraktikumForm labs={labs.data} data={praktikum} />
        </CardContent>
      </Card>
    </div>
  );
};






export default Detail;
