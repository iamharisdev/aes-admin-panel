import Button from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Hospital } from "@/types";

interface HospitalsTableProps {
  hospitals: Hospital[];
  loading: boolean;
  error: string;
  page: number;
  limit: number;
  onEdit: (hospital: Hospital) => void;
  onDelete: (hospital: Hospital) => void;
}

export default function HospitalsTable({
  hospitals,
  loading,
  error,
  page,
  limit,
  onEdit,
  onDelete,
}: HospitalsTableProps) {
  if (error) {
    return <div className="p-8 text-center text-red-500 text-sm">{error}</div>;
  }

  if (loading) {
    return (
      <div className="p-8 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (hospitals.length === 0) {
    return (
      <div className="p-12 text-center">
        <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <p className="text-gray-500 text-sm">No hospitals found.</p>
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100 bg-gray-50">
          <th className="text-left px-5 py-3 font-medium text-gray-500 w-8">#</th>
          <th className="text-left px-5 py-3 font-medium text-gray-500">Name</th>
          <th className="text-left px-5 py-3 font-medium text-gray-500">Phone</th>
          <th className="text-left px-5 py-3 font-medium text-gray-500">Email</th>
          <th className="text-left px-5 py-3 font-medium text-gray-500">City</th>
          <th className="text-left px-5 py-3 font-medium text-gray-500">Contact Person</th>
          <th className="text-left px-5 py-3 font-medium text-gray-500 w-24">Status</th>
          <th className="text-right px-5 py-3 font-medium text-gray-500 w-28">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {hospitals.map((hospital, i) => (
          <tr key={hospital.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-5 py-4 text-gray-400">{(page - 1) * limit + i + 1}</td>
            <td className="px-5 py-4">
              <p className="font-medium text-gray-900">{hospital.name}</p>
              {hospital.address && (
                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">{hospital.address}</p>
              )}
            </td>
            <td className="px-5 py-4 text-gray-600">{hospital.phone}</td>
            <td className="px-5 py-4 text-gray-500">
              {hospital.email ?? <span className="italic text-gray-300">—</span>}
            </td>
            <td className="px-5 py-4 text-gray-500">
              {hospital.city ?? <span className="italic text-gray-300">—</span>}
            </td>
            <td className="px-5 py-4 text-gray-500">
              {hospital.contactPerson ?? <span className="italic text-gray-300">—</span>}
            </td>
            <td className="px-5 py-4">
              {hospital.isActive === "Y" ? (
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                  Active
                </span>
              ) : (
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                  Inactive
                </span>
              )}
            </td>
            <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="xs"
                  leftIcon={<Pencil className="w-4 h-4" />}
                  title="Edit"
                  onClick={() => onEdit(hospital)}
                  className="text-gray-400 hover:text-green-600 hover:bg-green-50"
                />
                <Button
                  variant="ghost"
                  size="xs"
                  leftIcon={<Trash2 className="w-4 h-4" />}
                  title="Delete"
                  onClick={() => onDelete(hospital)}
                  className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
