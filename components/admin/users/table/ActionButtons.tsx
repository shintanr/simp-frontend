// components/ActionButtons.tsx

import { useRouter } from "next/navigation";
import { SquarePen } from "lucide-react";
import { UserType } from "@/types/user";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  data: UserType; // Menerima data pengguna sebagai props
}

export const ActionButtons = ({ data }: ActionButtonsProps) => {
  const router = useRouter();
  const handleEdit = (id: string) => {
    // Arahkan ke halaman detail user
    router.push(`/admin/users/${id}`);
  };

  return (
    <div className="flex space-x-2">
      {/* Tombol Edit */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleEdit(data.id_user.toString())} // Menggunakan data yang diterima
        className="rounded-full border-0 shadow-md transition duration-300 hover:shadow-lg hover:border-primary hover:scale-110"
      >
        <SquarePen size={16} className="text-primary" />
      </Button>

    </div>
  );
};

export default ActionButtons;
