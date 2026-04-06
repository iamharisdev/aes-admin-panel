"use client";

import { useState } from "react";
import { userService } from "@/lib/services/user.service";
import Button from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { User } from "@/types";

interface DeleteConfirmModalProps {
  user: User;
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteConfirmModal({ user, onClose, onDeleted }: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await userService.remove(user.id);
      onDeleted();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Delete &quot;{user.name}&quot;?</h3>
          <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" fullWidth loading={loading} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
