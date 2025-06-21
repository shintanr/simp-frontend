"use client";

import AdminUserForm from "@/components/admin/users/Forms/adminUserForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDetailUserQuery } from "@/redux/services/userApi";
import { useParams } from "next/navigation";
import React from "react";

const DetailUser = () => {
  const { id } = useParams();
  const {
    data: user,
    isLoading: isLoadingUser,
  } = useDetailUserQuery(id, {
    skip: !id,
  });

  if(isLoadingUser) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-10 ">
      <h1 className="text-2xl font-bold mb-4">Ubah User</h1>
      <Card className="bg-white shadow-xl">
        <CardHeader className="p-6">
          <CardTitle>Pastikan form diisi dengan benar</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <AdminUserForm user={user} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailUser;
