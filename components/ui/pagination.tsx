"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  total?: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 bg-white">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        leftIcon={<ChevronLeft className="w-4 h-4" />}
      >
        Previous
      </Button>

      <div className="flex items-center gap-1">
        {[...Array(totalPages)].map((_, i) => {
          const p = i + 1;
          if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
            return (
              <Button
                key={p}
                variant={p === page ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onPageChange(p)}
                className={[
                  "min-w-[36px]",
                  p === page ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-50" : "",
                ].filter(Boolean).join(" ")}
              >
                {p}
              </Button>
            );
          }
          if (Math.abs(p - page) === 2) {
            return (
              <span key={p} className="px-1 text-gray-400">
                ...
              </span>
            );
          }
          return null;
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        rightIcon={<ChevronRight className="w-4 h-4" />}
      >
        Next
      </Button>
    </div>
  );
}
