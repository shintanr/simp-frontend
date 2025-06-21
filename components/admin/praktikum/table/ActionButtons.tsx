// components/ActionButtons.tsx

import { useRouter } from "next/navigation";
import { SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Praktikum } from "@/types/praktikum";

interface ActionButtonsProps {
  data: Praktikum; // Menerima data pengguna sebagai props
}

export const ActionButtons = ({ data }: ActionButtonsProps) => {
  const router = useRouter();
  const handleEdit = (id: string) => {
    // Arahkan ke halaman detail user
    router.push(`/admin/praktikum/${id}`);
  };

  return (
    <div className="flex space-x-2">
      {/* Tombol Edit */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleEdit(data.id_praktikum.toString())} // Menggunakan data yang diterima
        className="rounded-full border-0 shadow-md transition duration-300 hover:shadow-lg hover:border-[#0267FE] hover:scale-110"
      >
        <SquarePen size={16} className="text-primary" />
      </Button>

    </div>
  );
};


export default ActionButtons;
