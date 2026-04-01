"use client";

import { useState } from "react";
import { roleService } from "@/lib/services/role.service";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { X } from "lucide-react";
import type { Role } from "@/types";

interface RoleFormModalProps {
  /** Pass a role to edit; omit for create */
  initial?: Role;
  onClose: () => void;
  onSaved: () => void;
}

export default function RoleFormModal({ initial, onClose, onSaved }: RoleFormModalProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setError("");
    setLoading(true);
    try {
      if (initial) {
        await roleService.update(initial.id, { name, description });
      } else {
        await roleService.create({ name, description });
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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">

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
        <form action={handleSubmit} className="p-6 space-y-4">
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
            rows={3}
            placeholder="What does this role allow?"
            hint="Optional — helps identify the role's purpose."
          />

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
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
