"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { roleService } from "@/lib/services/role.service";
import { permissionService } from "@/lib/services/permission.service";
import Button from "@/components/ui/button";
import Pagination from "@/components/ui/pagination";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { X, Search, Check } from "lucide-react";
import type { Permission, Role } from "@/types";

const PERM_LIMIT = 50;

interface RoleFormModalProps {
  /** Pass a role to edit; omit for create */
  initial?: Role;
  onClose: () => void;
  onSaved: () => void;
}

export default function RoleFormModal({ initial, onClose, onSaved }: RoleFormModalProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<string>>(new Set());
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionsLoading, setPermissionsLoading] = useState(true);
  const [permPagination, setPermPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [permSearch, setPermSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load permissions with pagination
  const loadPermissions = useCallback(async (page: number, search: string) => {
    setPermissionsLoading(true);
    try {
      const { data } = await permissionService.getAll({
        page,
        limit: PERM_LIMIT,
        search: search || undefined,
      });
      setPermissions(data.data);
      const pg = (data as { pagination?: { page: number; total: number; totalPages: number } }).pagination;
      setPermPagination({
        page: pg?.page ?? page,
        total: pg?.total ?? data.data.length,
        totalPages: pg?.totalPages ?? 1,
      });
    } catch {
      setError("Failed to load permissions.");
    } finally {
      setPermissionsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPermissions(1, permSearch);
  }, [loadPermissions, permSearch]);

  // Pre-select permissions when editing
  useEffect(() => {
    if (initial?.permissions) {
      const ids = new Set(initial.permissions.map((rp) => rp.permission.id));
      setSelectedPermissionIds(ids);
    }
  }, [initial]);

  // Group current page permissions by resource
  const grouped = useMemo(() => {
    const map = new Map<string, Permission[]>();
    for (const p of permissions) {
      const group = map.get(p.resource) ?? [];
      group.push(p);
      map.set(p.resource, group);
    }
    return map;
  }, [permissions]);

  function togglePermission(id: string) {
    setSelectedPermissionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleResource(resource: string) {
    const permsInGroup = grouped.get(resource) ?? [];
    const allSelected = permsInGroup.every((p) => selectedPermissionIds.has(p.id));
    setSelectedPermissionIds((prev) => {
      const next = new Set(prev);
      for (const p of permsInGroup) {
        if (allSelected) {
          next.delete(p.id);
        } else {
          next.add(p.id);
        }
      }
      return next;
    });
  }

  function selectAllOnPage() {
    setSelectedPermissionIds((prev) => {
      const next = new Set(prev);
      for (const p of permissions) {
        next.add(p.id);
      }
      return next;
    });
  }

  function deselectAll() {
    setSelectedPermissionIds(new Set());
  }

  async function handleSubmit() {
    setError("");
    setLoading(true);
    try {
      const permissionIds = Array.from(selectedPermissionIds);

      if (initial) {
        // Update role name/description
        await roleService.update(initial.id, { name, description });
        // Assign permissions (replaces existing)
        if (permissionIds.length > 0) {
          await roleService.assignPermissions(initial.id, { permissionIds });
        } else {
          // If no permissions selected, remove all
          const currentPermIds = initial.permissions?.map((rp) => rp.permission.id) ?? [];
          if (currentPermIds.length > 0) {
            await roleService.removePermissions(initial.id, { permissionIds: currentPermIds });
          }
        }
      } else {
        // Create the role first
        const { data } = await roleService.create({ name, description });
        const newRole = data.data;
        // Then assign permissions if any selected
        if (permissionIds.length > 0) {
          await roleService.assignPermissions(newRole.id, { permissionIds });
        }
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  const actionColors: Record<string, string> = {
    create: "bg-emerald-100 text-emerald-700",
    read: "bg-green-100 text-green-700",
    update: "bg-amber-100 text-amber-700",
    delete: "bg-red-100 text-red-700",
    assign_permission: "bg-purple-100 text-purple-700",
    remove_permission: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {initial ? "Edit Role" : "New Role"}
          </h2>
          <Button
            variant="ghost"
            size="xs"
            onClick={onClose}
            className="text-gray-400"
            leftIcon={<X className="w-4 h-4" />}
          />
        </div>

        {/* Form */}
        <form action={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            <Input
              label="Role name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              placeholder="e.g. Hospital Manager"
            />

            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="What does this role allow?"
              hint="Optional — helps identify the role's purpose."
            />

            {/* Permissions Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Permissions
                  <span className="ml-2 text-xs text-gray-400 font-normal">
                    {selectedPermissionIds.size} selected
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={selectAllOnPage}
                    className="text-xs text-green-600 hover:text-green-700 font-medium"
                  >
                    Select page
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={deselectAll}
                    className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                  >
                    Clear all
                  </button>
                </div>
              </div>

              {/* Search permissions */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search permissions..."
                  value={permSearch}
                  onChange={(e) => setPermSearch(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-400"
                />
              </div>

              {/* Permissions list + fixed pagination */}
              <div className="border border-gray-200 rounded-xl overflow-hidden flex flex-col">
                {/* Scrollable permissions area */}
                <div className="max-h-64 overflow-y-auto">
                  {permissionsLoading ? (
                    <div className="p-6 space-y-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />
                      ))}
                    </div>
                  ) : permissions.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 text-sm">
                      {permSearch ? "No permissions match your search." : "No permissions available."}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {Array.from(grouped.entries()).map(([resource, perms]) => {
                        const allInGroupSelected = perms.every((p) =>
                          selectedPermissionIds.has(p.id)
                        );
                        const someInGroupSelected =
                          !allInGroupSelected &&
                          perms.some((p) => selectedPermissionIds.has(p.id));

                        return (
                          <div key={resource}>
                            {/* Resource header */}
                            <button
                              type="button"
                              onClick={() => toggleResource(resource)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                              <div
                                className={[
                                  "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors shrink-0",
                                  allInGroupSelected
                                    ? "bg-green-600 border-green-600"
                                    : someInGroupSelected
                                    ? "bg-green-100 border-green-600"
                                    : "border-gray-300",
                                ].join(" ")}
                              >
                                {allInGroupSelected && (
                                  <Check className="w-3 h-3 text-white" />
                                )}
                                {someInGroupSelected && (
                                  <div className="w-2 h-0.5 bg-green-600 rounded" />
                                )}
                              </div>
                              <span className="text-sm font-medium text-gray-700 capitalize">
                                {resource}
                              </span>
                              <span className="text-xs text-gray-400 ml-auto">
                                {perms.filter((p) => selectedPermissionIds.has(p.id)).length}/{perms.length}
                              </span>
                            </button>

                            {/* Permission items */}
                            <div className="px-4 py-1">
                              {perms.map((p) => {
                                const selected = selectedPermissionIds.has(p.id);
                                return (
                                  <button
                                    type="button"
                                    key={p.id}
                                    onClick={() => togglePermission(p.id)}
                                    className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                  >
                                    <div
                                      className={[
                                        "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors shrink-0",
                                        selected
                                          ? "bg-green-600 border-green-600"
                                          : "border-gray-300",
                                      ].join(" ")}
                                    >
                                      {selected && (
                                        <Check className="w-3 h-3 text-white" />
                                      )}
                                    </div>
                                    <span className="text-sm text-gray-700 flex-1 text-left">
                                      {p.name}
                                    </span>
                                    <span
                                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                        actionColors[p.action] ?? "bg-gray-100 text-gray-700"
                                      }`}
                                    >
                                      {p.action}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Fixed pagination bar at bottom */}
              
                  <div className="shrink-0">
                    <Pagination
                      page={permPagination.page}
                      totalPages={permPagination.totalPages}
                      total={permPagination.total}
                      onPageChange={(p) => loadPermissions(p, permSearch)}
                    />
                  </div>
             
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-3 p-6 border-t border-gray-100">
            <Button type="button" variant="outline" fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth loading={loading}>
              {initial ? "Update" : "Create"}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}
