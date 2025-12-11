"use client";

import { useEffect } from "react";

export default function VisitorTracker() {
  useEffect(() => {
    // Appel silencieux, on ignore les erreurs
    fetch("/api/track").catch(() => {});
  }, []);

  return null;
}
