"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search, AlertCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type DropdownSize = "sm" | "md" | "lg";

export interface DropdownProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  options?: DropdownOption[];
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  dropdownSize?: DropdownSize;
  /** Force the search box on/off. Auto-shows when options > 5. */
  searchable?: boolean;
  id?: string;
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const sizeClasses: Record<DropdownSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-9 px-3 text-sm",
  lg: "h-11 px-4 text-base",
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function Dropdown({
  label,
  value = "",
  onChange,
  onBlur,
  options = [],
  placeholder = "Select…",
  error,
  hint,
  disabled = false,
  loading = false,
  required,
  dropdownSize = "md",
  searchable,
  id,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const uid = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  const showSearch = searchable ?? options.length > 5;

  const filtered = search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  const selectedLabel = options.find((o) => o.value === value)?.label;

  // ── Open / close ─────────────────────────────────────────────────────────

  function openPanel() {
    if (disabled || loading) return;
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const PANEL_MAX_H = 264;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUp = spaceBelow < PANEL_MAX_H + 8 && rect.top > PANEL_MAX_H + 8;

      setPanelStyle({
        position: "fixed" as const,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
        ...(openUp
          ? { bottom: window.innerHeight - rect.top + 4 }
          : { top: rect.bottom + 4 }),
      });
    }
    setSearch("");
    setHighlighted(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  }

  function closePanel(refocus = true) {
    setOpen(false);
    onBlur?.();
    if (refocus) triggerRef.current?.focus();
  }

  function select(opt: DropdownOption) {
    if (opt.disabled) return;
    onChange?.(opt.value);
    closePanel(true);
  }

  // ── Click outside ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
      onBlur?.();
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open, onBlur]);

  // ── Auto-focus search ────────────────────────────────────────────────────

  useEffect(() => {
    if (open && showSearch) {
      const t = setTimeout(() => searchRef.current?.focus(), 10);
      return () => clearTimeout(t);
    }
  }, [open, showSearch]);

  // ── Keyboard ─────────────────────────────────────────────────────────────

  function onTriggerKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        openPanel();
      }
      return;
    }
    handleNavKeys(e);
  }

  function onSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    handleNavKeys(e);
  }

  function handleNavKeys(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      closePanel();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = filtered[highlighted];
      if (opt) select(opt);
    }
  }

  // ── Styles ────────────────────────────────────────────────────────────────

  const ringClass = error
    ? "border-red-400 ring-1 ring-red-400"
    : open
    ? "border-green-500 ring-2 ring-green-500 ring-offset-0"
    : "border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent";

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={uid} className="text-sm font-medium text-gray-700 select-none">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Trigger */}
      {loading ? (
        <div className={`${sizeClasses[dropdownSize]} rounded-xl bg-gray-100 animate-pulse`} />
      ) : (
        <button
          ref={triggerRef}
          id={uid}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => (open ? closePanel(false) : openPanel())}
          onKeyDown={onTriggerKeyDown}
          className={[
            "w-full flex items-center justify-between rounded-xl border outline-none transition-all bg-white shadow-sm",
            sizeClasses[dropdownSize],
            ringClass,
            "disabled:opacity-50 disabled:cursor-not-allowed",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span className={selectedLabel ? "text-gray-900 truncate" : "text-gray-400"}>
            {selectedLabel ?? placeholder}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      )}

      {/* Floating panel */}
      {open && (
        <div
          ref={panelRef}
          role="listbox"
          aria-label={label}
          style={panelStyle}
          className="bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
        >
          {showSearch && (
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setHighlighted(0);
                  }}
                  onKeyDown={onSearchKeyDown}
                  placeholder="Search…"
                  className="w-full h-8 pl-8 pr-3 text-sm rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
                />
              </div>
            </div>
          )}

          <ul className="max-h-52 overflow-y-auto py-1" role="presentation">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-400 text-center">No options found.</li>
            ) : (
              filtered.map((opt, idx) => {
                const isSelected = opt.value === value;
                const isHighlighted = idx === highlighted;
                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={opt.disabled}
                    onMouseEnter={() => setHighlighted(idx)}
                    onClick={() => select(opt)}
                    className={[
                      "flex items-center justify-between px-3 py-2 text-sm cursor-pointer select-none transition-colors",
                      opt.disabled ? "opacity-40 cursor-not-allowed" : "",
                      isHighlighted && !opt.disabled
                        ? "bg-green-50 text-green-700"
                        : "text-gray-700",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}

      {/* Error / hint */}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-500">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
