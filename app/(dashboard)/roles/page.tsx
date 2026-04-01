"use client";

import { useEffect, useState, useCallback } from "react";
import { roleService } from "@/lib/services/role.service";
import Header from "../_components/header";
import Button from "@/components/ui/button";
import SearchBar from "@/components/ui/search-bar";
import Pagination from "@/components/ui/pagination";
import RolesTable from "./_components/roles-table";
import RoleDetailModal from "./_components/role-detail-modal";
import RoleFormModal from "./_components/role-form-modal";
import DeleteConfirmModal from "./_components/delete-confirm-modal";
import type { Role } from "@/types";

const LIMIT = 10;

import { Plus } from "lucide-react";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [detailRole, setDetailRole] = useState<Role | null>(null);
  const [editRole, setEditRole] = useState<Role | undefined>(undefined);
  const [deleteRole, setDeleteRole] = useState<Role | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async (page: number, q: string) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await roleService.getAll({ page, limit: LIMIT, search: q || undefined, includePermissions: true });
      const items = data.data;
      setRoles(items);
      const pg = (data as { pagination?: { page: number; total: number; totalPages: number } }).pagination;
      setPagination({
        page: pg?.page ?? page,
        total: pg?.total ?? items.length,
        totalPages: pg?.totalPages ?? 1,
      });
    } catch {
      setError("Failed to load roles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(1, search);
  }, [load, search]);

  async function openDetail(role: Role) {
    if (!role.permissions) {
      try {
        const { data } = await roleService.getById(role.id, true);
        setDetailRole(data.data);
      } catch {
        setDetailRole(role);
      }
    } else {
      setDetailRole(role);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Roles" />

      <div className="flex-1 p-6 space-y-5">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Roles</h1>
            <p className="text-sm text-gray-500 mt-0.5">{pagination.total} total roles</p>
          </div>

          <div className="flex items-center gap-3">
            <SearchBar placeholder="Search roles..." onSearch={setSearch} />
            <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>
              New Role
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <RolesTable
            roles={roles}
            loading={loading}
            error={error}
            page={pagination.page}
            limit={LIMIT}
            onRowClick={openDetail}
            onEdit={setEditRole}
            onDelete={setDeleteRole}
          />
        </div>

        {/* Pagination */}
        {!loading && (
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            onPageChange={(p) => load(p, search)}
          />
        )}
      </div>

      {/* Modals */}
      {detailRole && (
        <RoleDetailModal role={detailRole} onClose={() => setDetailRole(null)} />
      )}
      {(showCreate || editRole) && (
        <RoleFormModal
          initial={editRole}
          onClose={() => { setShowCreate(false); setEditRole(undefined); }}
          onSaved={() => load(pagination.page, search)}
        />
      )}
      {deleteRole && (
        <DeleteConfirmModal
          role={deleteRole}
          onClose={() => setDeleteRole(null)}
          onDeleted={() => load(pagination.page, search)}
        />
      )}
    </div>
  );
}
