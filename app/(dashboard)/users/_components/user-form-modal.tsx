"use client";

import { useState, useEffect, useCallback } from "react";
import { userService } from "@/lib/services/user.service";
import { roleService } from "@/lib/services/role.service";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { X } from "lucide-react";
import type { Role, User } from "@/types";

interface UserFormModalProps {
  /** Pass a user to edit; omit for create */
  initial?: User;
  onClose: () => void;
  onSaved: () => void;
}

export default function UserFormModal({ initial, onClose, onSaved }: UserFormModalProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phoneNumber, setPhoneNumber] = useState(initial?.phoneNumber ?? "");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState(initial?.roleId ?? "");
  const [isActive, setIsActive] = useState<"Y" | "N">(initial?.isActive ?? "Y");
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRoles = useCallback(async () => {
    setRolesLoading(true);
    try {
      const { data } = await roleService.getAll({ limit: 100 });
      setRoles(data.data);
    } catch {
      setError("Failed to load roles.");
    } finally {
      setRolesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  async function handleSubmit() {
    setError("");
    if (!roleId) {
      setError("Please select a role.");
      return;
    }
    setLoading(true);
    try {
      if (initial) {
        await userService.update(initial.id, {
          name,
          email,
          phoneNumber: phoneNumber || undefined,
          roleId,
          isActive,
        });
      } else {
        await userService.create({
          name,
          email,
          phoneNumber: phoneNumber || undefined,
          password,
          roleId,
          isActive,
        });
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {initial ? "Edit User" : "New User"}
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
              label="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              placeholder="e.g. John Smith"
            />

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. john@example.com"
            />

            <Input
              label="Phone number"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Optional"
            />

            {!initial && (
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Min. 8 chars, 1 uppercase, 1 number, 1 special"
              />
            )}

            {/* Role select */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Role</label>
              {rolesLoading ? (
                <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
              ) : (
                <select
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  required
                  className="w-full h-10 px-3 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-gray-900"
                >
                  <option value="">Select a role…</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Status select */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={isActive}
                onChange={(e) => setIsActive(e.target.value as "Y" | "N")}
                className="w-full h-10 px-3 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-gray-900"
              >
                <option value="Y">Active</option>
                <option value="N">Inactive</option>
              </select>
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
