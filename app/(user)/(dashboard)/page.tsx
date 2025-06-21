"use client";

import PraktikumList from "@/components/dashboard/PraktikumList";
import { useGetUserPraktikumQuery } from "@/redux/services/userPraktikum";
import { useLabStore } from "@/store/labStore";

function Page() {
  const { selectedLab } = useLabStore();

  const { data : userPraktikum, isLoading, error } = useGetUserPraktikumQuery({
    lab_id:  selectedLab?.id || "1",
  });
  console.log("🚀 ~ Page ~ userPraktikum:", userPraktikum)

  if(isLoading || error ) return (
    <div className="flex min-h-screen">
      {/* Main content */}
      <main className="flex-1 p-8">
        <PraktikumList praktikum={[]} selectedLab="" />
      </main>
    </div>
  )
  return (
    <div className="flex min-h-screen">
      {/* Main content */}
        <PraktikumList praktikum={userPraktikum.data} selectedLab={selectedLab?.name || ""} />
    </div>
  );
}

export default Page;
