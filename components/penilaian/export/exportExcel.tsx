import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { PenilaianType } from "@/types/penilaian";

const ExportToExcel = ({
  data,
  filename = "data.xlsx",
}: {
  data: PenilaianType[];
  filename?: string;
}) => {
  const exportFile = () => {
    const cleanedData = data.map((item) => {
      const entries = Object.entries(item).filter(
        ([key]) =>
          !key.startsWith("id_") && key !== "id" && key !== "is_asisten"
      );

      const cleanedItem = Object.fromEntries(entries);

      // Ubah nilai kosong jadi "-"
      Object.keys(cleanedItem).forEach((key) => {
        const value = cleanedItem[key];
        if (value === null || value === undefined || value === "") {
          cleanedItem[key] = "-";
        }
      });

      return cleanedItem;
    });

    const worksheet = XLSX.utils.json_to_sheet(cleanedData); // data = array of objects
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, filename);
  };

  return <Button onClick={exportFile}>Export ke Excel</Button>;
};

export default ExportToExcel;
