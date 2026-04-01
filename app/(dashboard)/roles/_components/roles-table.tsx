import Button from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Permission, Role } from "@/types";

const MAX_VISIBLE_PERMISSIONS = 3;

function PermissionsBadges({ permissions }: { permissions: Permission[] }) {
  const visible = permissions.slice(0, MAX_VISIBLE_PERMISSIONS);
  const remaining = permissions.length - MAX_VISIBLE_PERMISSIONS;

  if (permissions.length === 0) {
    return <span className="text-xs text-gray-400 italic">No permissions</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((p) => (
        <span key={p.id} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">
          {p.name}
        </span>
      ))}
      {remaining > 0 && (
        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
          +{remaining} more
        </span>
      )}
    </div>
  );
}

interface RolesTableProps {
  roles: Role[];
  loading: boolean;
  error: string;
  page: number;
  limit: number;
  onRowClick: (role: Role) => void;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export default function RolesTable({ roles, loading, error, page, limit, onRowClick, onEdit, onDelete }: RolesTableProps) {
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

  if (roles.length === 0) {
    return (
      <div className="p-12 text-center">
        <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p className="text-gray-500 text-sm">No roles found.</p>
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100 bg-gray-50">
          <th className="text-left px-5 py-3 font-medium text-gray-500 w-8">#</th>
          <th className="text-left px-5 py-3 font-medium text-gray-500">Role</th>
          <th className="text-left px-5 py-3 font-medium text-gray-500">Permissions</th>
          <th className="text-left px-5 py-3 font-medium text-gray-500 w-24">Type</th>
          <th className="text-right px-5 py-3 font-medium text-gray-500 w-28">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {roles.map((role, i) => {
          const perms = role.permissions?.map((rp) => rp.permission) ?? [];
          return (
            <tr
              key={role.id}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onRowClick(role)}
            >
              <td className="px-5 py-4 text-gray-400">{(page - 1) * limit + i + 1}</td>
              <td className="px-5 py-4">
                <p className="font-medium text-gray-900">{role.name}</p>
                {role.description && (
                  <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{role.description}</p>
                )}
              </td>
              <td className="px-5 py-4">
                <PermissionsBadges permissions={perms} />
              </td>
              <td className="px-5 py-4">
                {role.isSystemRole ? (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    System
                  </span>
                ) : (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    Custom
                  </span>
                )}
              </td>
              <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<Pencil className="w-4 h-4" />}
                    disabled={role.isSystemRole}
                    title={role.isSystemRole ? "Cannot edit system role" : "Edit"}
                    onClick={() => onEdit(role)}
                    className="text-gray-400 hover:text-green-600 hover:bg-green-50"
                  />
                  <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<Trash2 className="w-4 h-4" />}
                    disabled={role.isSystemRole}
                    title={role.isSystemRole ? "Cannot delete system role" : "Delete"}
                    onClick={() => onDelete(role)}
                    className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                  />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
