"use client";

import { useEffect, useState, useCallback } from "react";
import { hospitalService } from "@/lib/services/hospital.service";
import Header from "../_components/header";
import Button from "@/components/ui/button";
import SearchBar from "@/components/ui/search-bar";
import Pagination from "@/components/ui/pagination";
import HospitalsTable from "./_components/hospitals-table";
import HospitalFormModal from "./_components/hospital-form-modal";
import DeleteConfirmModal from "./_components/delete-confirm-modal";
import type { Hospital } from "@/types";
import { Plus } from "lucide-react";

const LIMIT = 10;

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editHospital, setEditHospital] = useState<Hospital | undefined>(undefined);
  const [deleteHospital, setDeleteHospital] = useState<Hospital | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async (page: number, q: string) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await hospitalService.getAll({ page, limit: LIMIT, search: q || undefined });
      const items = data.data;
      setHospitals(items);
      const pg = (data as { pagination?: { page: number; total: number; totalPages: number } }).pagination;
      setPagination({
        page: pg?.page ?? page,
        total: pg?.total ?? items.length,
        totalPages: pg?.totalPages ?? 1,
      });
    } catch {
      setError("Failed to load hospitals.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(1, search);
  }, [load, search]);

  return (
    <div className="flex flex-col h-full">
      <Header title="Hospitals" />

      <div className="flex-1 p-6 space-y-5">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Hospitals</h1>
            <p className="text-sm text-gray-500 mt-0.5">{pagination.total} total hospitals</p>
          </div>

          <div className="flex items-center gap-3">
            <SearchBar placeholder="Search hospitals..." onSearch={setSearch} />
            <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>
              New Hospital
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <HospitalsTable
            hospitals={hospitals}
            loading={loading}
            error={error}
            page={pagination.page}
            limit={LIMIT}
            onEdit={setEditHospital}
            onDelete={setDeleteHospital}
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
      {(showCreate || editHospital) && (
        <HospitalFormModal
          initial={editHospital}
          onClose={() => { setShowCreate(false); setEditHospital(undefined); }}
          onSaved={() => load(pagination.page, search)}
        />
      )}
      {deleteHospital && (
        <DeleteConfirmModal
          hospital={deleteHospital}
          onClose={() => setDeleteHospital(null)}
          onDeleted={() => load(pagination.page, search)}
        />
      )}
    </div>
  );
}
