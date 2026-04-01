"use client";

import { useEffect, useState } from "react";
import { registerLoadingNotifier } from "@/lib/loading";
import { Loader2 } from "lucide-react";

export default function AppLoader() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    registerLoadingNotifier(setLoading);
  }, []);

  // Animate progress bar while loading
  useEffect(() => {
    if (!loading) {
      // Jump to 100% then hide
      setProgress(100);
      const t = setTimeout(() => setProgress(0), 400);
      return () => clearTimeout(t);
    }

    // Start at 10%, crawl to ~85% while waiting
    setProgress(10);
    const intervals = [
      setTimeout(() => setProgress(30), 100),
      setTimeout(() => setProgress(55), 400),
      setTimeout(() => setProgress(72), 900),
      setTimeout(() => setProgress(85), 1800),
    ];
    return () => intervals.forEach(clearTimeout);
  }, [loading]);

  if (progress === 0) return null;

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-0.5 bg-transparent pointer-events-none">
        <div
          className="h-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] transition-all"
          style={{
            width: `${progress}%`,
            transitionDuration: loading ? "600ms" : "200ms",
            transitionTimingFunction: "ease-out",
            opacity: progress === 100 ? 0 : 1,
            transitionProperty: "width, opacity",
          }}
        />
      </div>

      {/* Spinner in top-right */}
      {loading && (
        <div className="fixed top-4 right-4 z-[9999] pointer-events-none">
          <div className="w-7 h-7 rounded-full bg-white shadow-lg flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
          </div>
        </div>
      )}
    </>
  );
}
