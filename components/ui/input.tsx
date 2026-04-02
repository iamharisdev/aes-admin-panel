"use client";

import { useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

// ─── Password Toggle ──────────────────────────────────────────────────────────

function PasswordToggle({ show, onToggle, dark }: { show: boolean; onToggle: () => void; dark: boolean }) {
  return (
    <button
      type="button"
      tabIndex={-1}
      onClick={onToggle}
      className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
        dark ? "text-slate-400 hover:text-slate-200" : "text-gray-400 hover:text-gray-600"
      }`}
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  inputSize?: InputSize;
  /** Dark background variant — for login page */
  dark?: boolean;
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const sizeClasses: Record<InputSize, { input: string; icon: string }> = {
  sm: { input: "h-8 text-sm px-3",  icon: "w-3.5 h-3.5" },
  md: { input: "h-9 text-sm px-3",  icon: "w-4 h-4" },
  lg: { input: "h-11 text-base px-4", icon: "w-4.5 h-4.5" },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  inputSize = "md",
  dark = false,
  className = "",
  id,
  type,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  const { input: inputSz, icon: iconSz } = sizeClasses[inputSize];
  const hasLeft = Boolean(leftIcon);
  const hasRight = Boolean(rightIcon) || isPassword;

  const baseInput = dark
    ? "bg-white/5 border-white/10 text-white placeholder-slate-500 focus:ring-green-500"
    : error
    ? "bg-white border-red-400 text-gray-900 placeholder-gray-400 focus:ring-red-400"
    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500";

  return (
    <div className="flex flex-col gap-1.5 w-full ">
      {label && (
        <label
          htmlFor={inputId}
          className={`text-sm font-medium ${dark ? "text-slate-900" : "text-gray-700"}`}
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center shadow-sm">
        {hasLeft && (
          <span
            className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
              dark ? "text-slate-400" : "text-gray-400"
            } ${iconSz}`}
          >
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={[
            "w-full rounded-xl border outline-none transition-all",
            "focus:ring-2 focus:border-transparent",
            inputSz,
            hasLeft ? "pl-9" : "",
            hasRight ? "pr-9" : "",
            baseInput,
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />

        {isPassword ? (
          <PasswordToggle
            show={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
            dark={dark}
          />
        ) : hasRight && (
          <span
            className={`absolute right-3 top-1/2 -translate-y-1/2 ${
              dark ? "text-slate-400" : "text-gray-400"
            } ${iconSz}`}
          >
            {rightIcon}
          </span>
        )}
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-500">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}

      {hint && !error && (
        <p className="text-xs text-gray-400">{hint}</p>
      )}
    </div>
  );
}
