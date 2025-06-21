"use client";

import { columns } from "./columns";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { useGetUsersQuery } from "@/redux/services/userApi";

export default function UsersListTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("created_at"); // Default sorting column
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");

  // Fetch data dengan parameter search, sorting, dan pagination
  const { data, error, isLoading } = useGetUsersQuery({
    page: page,
    limit: limit,
    search: search,
    orderBy: orderBy,
    sortDirection: sortDirection,
  });

  const [totalPages, setTotalPages] = useState(1);

  // Perbarui total halaman saat data berubah
  useEffect(() => {
    if (data?.pagination?.total) {
      setTotalPages(Math.ceil(data.pagination.total / limit));
    }
  }, [data, limit]);
  

  // Fungsi untuk berpindah halaman
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Fungsi untuk mengubah limit
  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setPage(1); // Reset ke halaman pertama
  };

  // Fungsi untuk mengubah nilai pencarian
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset ke halaman pertama saat search berubah
  };

  // Fungsi untuk menangani sorting
  const handleSort = (column: string) => {
    if (orderBy === column) {
      setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
    } else {
      setOrderBy(column);
      setSortDirection("ASC");
    }
  };

  if (!data || error || isLoading ) return null;

  return (
    <div className="container mx-auto w-full p-8">
      <div className="flex justify-between">
        <div className="flex flex-col justify-center mb-5">
          <h5 className="text-2xl font-bold text-gray-900">List Pengguna</h5>
          <h5 className="text-lg font-semibold text-gray-900">
            Total Pengguna: {data.pagination.total}
          </h5>
        </div>
        <Button asChild>
          <Link href="users/create">+Tambah Pengguna</Link>
        </Button>
      </div>

      {/* Search & data.pagination Controls */}
      <div className="bg-white rounded-xl shadow-2xl p-6">
        <div className="flex justify-between items-center py-2">
          <input
            type="text"
            placeholder="Cari..."
            className="border rounded px-3 py-1"
            value={search}
            onChange={handleSearchChange}
          />

          <div className="flex items-center">
            <label className="mr-2 text-sm font-medium">
              Baris per halaman:
            </label>
            <select
              className="border rounded px-2 py-1"
              value={limit}
              onChange={handleLimitChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        {!data || isLoading ? (
          <p>Loading...</p>
        ) : data && data.data ? (
          <DataTable
            columns={columns}
            data={data.data}
            pageCount={totalPages}
            currentPage={page}
            pageSize={limit}
            onPageChange={handlePageChange}
            orderBy={orderBy}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
}
