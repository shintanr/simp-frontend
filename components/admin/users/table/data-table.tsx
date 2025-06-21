"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react"; // Tambahkan ikon sort

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  currentPage: number;
  pageSize: number;
  orderBy: string;
  sortDirection: "ASC" | "DESC";
  onPageChange: (page: number) => void;
  onSort: (column: string) => void; // Fungsi untuk mengubah sorting
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  currentPage,
  pageSize,
  orderBy,
  sortDirection,
  onPageChange,
  onSort,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount,
    state: {
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: pageSize,
      },
    },
  });

  return (
    <div className="flex flex-col">
      <div className="rounded-md w-full overflow-x-auto">
        <Table className="bg-white">
          <TableHeader className="bg-[#74ABFF]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.id === orderBy;
                  return (
                    <TableHead
                      key={header.id}
                      onClick={() => onSort(header.column.id)}
                      className="cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {isSorted && (
                          sortDirection === "ASC" ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow key={row.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="text-sm">Page {currentPage} of {pageCount}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === pageCount}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
