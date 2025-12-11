// app/components/VisitorTracker.tsx (move it from admin folder)
"use client";

import { useEffect } from "react";

export default function VisitorTracker() {
  useEffect(() => {
    // Use POST to the dedicated tracking endpoint
    fetch("/api/track", { method: "POST" }).catch(() => {});
  }, []);

  return null;
}
