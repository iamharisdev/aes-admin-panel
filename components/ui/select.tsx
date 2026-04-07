"use client";

import type { SelectHTMLAttributes, ReactNode } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SelectSize = "sm" | "md" | "lg";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  selectSize?: SelectSize;
  /** Convenience prop — renders <option> list automatically */
  options?: SelectOption[];
  /** Shown as a disabled first option when nothing is selected */
  placeholder?: string;
  /** Shows an animated skeleton while data loads */
  loading?: boolean;
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const sizeClasses: Record<SelectSize, string> = {
  sm: "h-8 text-sm px-3",
  md: "h-9 text-sm px-3",
  lg: "h-11 text-base px-4",
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function Select({
  label,
  error,
  hint,
  leftIcon,
  selectSize = "md",
  options,
  placeholder,
  loading = false,
  className = "",
  id,
  children,
  ...props
}: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  const sz = sizeClasses[selectSize];
  const hasLeft = Boolean(leftIcon);

  const ringClass = error
    ? "border-red-400 focus:ring-red-400"
    : "border-gray-200 focus:ring-green-500";

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {loading ? (
        <div className={`${sz} bg-gray-100 rounded-xl animate-pulse`} />
      ) : (
        <div className="relative flex items-center">
          {hasLeft && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              {leftIcon}
            </span>
          )}

          <select
            id={selectId}
            className={[
              "w-full rounded-xl border outline-none transition-all appearance-none shadow-sm",
              "bg-white text-gray-900 focus:ring-2 focus:border-transparent",
              sz,
              hasLeft ? "pl-9" : "",
              "pr-9",
              ringClass,
              "disabled:opacity-50 disabled:cursor-not-allowed",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      )}

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
