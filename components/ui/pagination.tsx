"use client";

import Button from "./button";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, total, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between text-sm text-gray-500">
      <span>
        Page {page} of {totalPages} ({total} results)
      </span>

      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          ← Prev
        </Button>

        {[...Array(totalPages)].map((_, i) => {
          const p = i + 1;
          if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
            return (
              <Button
                key={p}
                size="sm"
                variant={p === page ? "primary" : "outline"}
                onClick={() => onPageChange(p)}
              >
                {p}
              </Button>
            );
          }
          if (Math.abs(p - page) === 2) {
            return <span key={p} className="px-1 py-1.5">…</span>;
          }
          return null;
        })}

        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next →
        </Button>
      </div>
    </div>
  );
}
