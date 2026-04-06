import Button from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { User } from "@/types";

interface UsersTableProps {
  users: User[];
  loading: boolean;
  error: string;
  page: number;
  limit: number;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UsersTable({ users, loading, error, page, limit, onEdit, onDelete }: UsersTableProps) {
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

  if (users.length === 0) {
    return (
      <div className="p-12 text-center">
        <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p className="text-gray-500 text-sm">No users found.</p>
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100 bg-gray-50">
          <th className="text-left px-5 py-3 font-medium text-gray-500 w-8">#</th>
          <th className="text-left px-5 py-3 font-medium text-gray-500">Name</th>
          <th className="text-left px-5 py-3 font-medium text-gray-500">Email</th>
          <th className="text-left px-5 py-3 font-medium text-gray-500">Phone</th>
          <th className="text-left px-5 py-3 font-medium text-gray-500">Role</th>
          <th className="text-left px-5 py-3 font-medium text-gray-500 w-24">Status</th>
          <th className="text-right px-5 py-3 font-medium text-gray-500 w-28">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {users.map((user, i) => (
          <tr key={user.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-5 py-4 text-gray-400">{(page - 1) * limit + i + 1}</td>
            <td className="px-5 py-4">
              <p className="font-medium text-gray-900">{user.name}</p>
            </td>
            <td className="px-5 py-4 text-gray-600">{user.email}</td>
            <td className="px-5 py-4 text-gray-500">{user.phoneNumber ?? <span className="italic text-gray-300">—</span>}</td>
            <td className="px-5 py-4">
              {user.role ? (
                <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">
                  {user.role.name}
                </span>
              ) : (
                <span className="text-xs text-gray-400 italic">—</span>
              )}
            </td>
            <td className="px-5 py-4">
              {user.isActive === "Y" ? (
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
                  onClick={() => onEdit(user)}
                  className="text-gray-400 hover:text-green-600 hover:bg-green-50"
                />
                <Button
                  variant="ghost"
                  size="xs"
                  leftIcon={<Trash2 className="w-4 h-4" />}
                  title="Delete"
                  onClick={() => onDelete(user)}
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
