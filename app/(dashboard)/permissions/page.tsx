"use client";

import { useEffect, useState, useCallback } from "react";
import { permissionService } from "@/lib/services/permission.service";
import Header from "../_components/header";
import SearchBar from "@/components/ui/search-bar";
import Pagination from "@/components/ui/pagination";
import PermissionsTable from "./_components/permissions-table";
import type { Permission } from "@/types";

const LIMIT = 10;

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (page: number, q: string) => {
    setLoading(true);
    setError("");


    try {
      const { data } = await permissionService.getAll({ page, limit: LIMIT, search: q || undefined });
      const items = data.data;
      setPermissions(items);
      const pg = (data as { pagination?: { page: number; total: number; totalPages: number } }).pagination;
      setPagination({
        page: pg?.page ?? page,
        total: pg?.total ?? items.length,
        totalPages: pg?.totalPages ?? 1,
      });
    } catch {
      setError("Failed to load permissions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(1, search);
  }, [load, search]);

  return (
    <div className="flex flex-col h-full">
      <Header title="Permissions" />

      <div className="flex-1 p-6 flex flex-col gap-5 min-h-0">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Permissions</h1>
            <p className="text-sm text-gray-500 mt-0.5">{pagination.total} total permissions</p>
          </div>

          <SearchBar placeholder="Search permissions..." onSearch={setSearch} />
        </div>

        {/* Table + fixed pagination */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto flex-1">
            <PermissionsTable
              permissions={permissions}
              loading={loading}
              error={error}
              page={pagination.page}
              limit={LIMIT}
            />
          </div>

          {/* Pagination pinned at bottom */}
         
            <div className="shrink-0">
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                total={pagination.total}
                onPageChange={(p) => load(p, search)}
              />
            </div>
      
        </div>
      </div>
    </div>
  );
}
