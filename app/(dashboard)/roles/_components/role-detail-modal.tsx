import Button from "@/components/ui/button";
import { X } from "lucide-react";
import type { Permission, Role } from "@/types";

const actionColors: Record<string, string> = {
  create: "bg-emerald-100 text-emerald-700",
  read: "bg-green-100 text-green-700",
  update: "bg-amber-100 text-amber-700",
  delete: "bg-red-100 text-red-700",
  assign_permission: "bg-purple-100 text-purple-700",
  remove_permission: "bg-orange-100 text-orange-700",
};

function PermissionRow({ permission: p }: { permission: Permission }) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
      <span className="text-sm text-gray-700 font-medium">{p.name}</span>
      <div className="flex items-center gap-1.5">
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
          {p.resource}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${actionColors[p.action] ?? "bg-gray-100 text-gray-700"}`}>
          {p.action}
        </span>
      </div>
    </div>
  );
}

interface RoleDetailModalProps {
  role: Role;
  onClose: () => void;
}

export default function RoleDetailModal({ role, onClose }: RoleDetailModalProps) {
  const permissions = role.permissions?.map((rp) => rp.permission) ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-semibold text-gray-900">{role.name}</h2>
              {role.isSystemRole && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  System
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{role.description ?? "No description"}</p>
          </div>
          <Button
            variant="ghost"
            size="xs"
            onClick={onClose}
            className="ml-4 text-gray-400"
            leftIcon={<X className="w-4 h-4" />}
          />
        </div>

        {/* Permissions list */}
        <div className="p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Permissions</h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {permissions.length} total
            </span>
          </div>

          {permissions.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No permissions assigned.
            </div>
          ) : (
            <div className="space-y-2">
              {permissions.map((p) => (
                <PermissionRow key={p.id} permission={p} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
