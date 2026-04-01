"use client";

import { useEffect, useState } from "react";

export default function Header({ title }: { title?: string }) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") ?? "{}");
      setUserName(user?.name ?? "");
      setUserEmail(user?.email ?? "");
    } catch { /* */ }
  }, []);

  return (
    <header className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-6 shrink-0">
      <h2 className="font-semibold text-gray-900 text-base">{title}</h2>
      {userName && (
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-700 leading-tight">{userName}</p>
            <p className="text-xs text-gray-400">{userEmail}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      )}
    </header>
  );
}
