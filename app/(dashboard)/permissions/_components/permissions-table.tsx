import type { Permission } from "@/types";

const actionColors: Record<string, string> = {
  create: "bg-emerald-100 text-emerald-700",
  read: "bg-green-100 text-green-700",
  update: "bg-amber-100 text-amber-700",
  delete: "bg-red-100 text-red-700",
  assign_permission: "bg-purple-100 text-purple-700",
  remove_permission: "bg-orange-100 text-orange-700",
};

interface PermissionsTableProps {
  permissions: Permission[];
  loading: boolean;
  error: string;
  page: number;
  limit: number;
}

export default function PermissionsTable({ permissions, loading, error, page, limit }: PermissionsTableProps) {
  if (error) {
    return <div className="p-8 text-center text-red-500 text-sm">{error}</div>;
  }

  if (loading) {
    return (
      <div className="p-8 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (permissions.length === 0) {
    return (
      <div className="p-12 text-center">
        <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gray-500 text-sm">No permissions found.</p>
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100 bg-gray-50">
          <th className="text-left px-5 py-3 font-medium text-gray-500 w-8">#</th>
          <th className="text-left px-5 py-3 font-medium text-gray-500">Name</th>
          <th className="text-left px-5 py-3 font-medium text-gray-500">Resource</th>
          <th className="text-left px-5 py-3 font-medium text-gray-500">Action</th>
          <th className="text-left px-5 py-3 font-medium text-gray-500">Description</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {permissions.map((p, i) => (
          <tr key={p.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-5 py-3.5 text-gray-400">{(page - 1) * limit + i + 1}</td>
            <td className="px-5 py-3.5 font-medium text-gray-800">{p.name}</td>
            <td className="px-5 py-3.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                {p.resource}
              </span>
            </td>
            <td className="px-5 py-3.5">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${actionColors[p.action] ?? "bg-gray-100 text-gray-700"}`}>
                {p.action}
              </span>
            </td>
            <td className="px-5 py-3.5 text-gray-500 max-w-xs truncate">
              {p.description ?? "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
