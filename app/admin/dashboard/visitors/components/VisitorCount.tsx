"use client";

import { useEffect, useState } from "react";

export default function VisitorCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/visitors")
      .then((r) => r.json())
      .then((data) => {
        if (mounted) setCount(data.total);
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <span>👥 Visiteurs uniques : </span>
      <strong>{count ?? "..."}</strong>
    </div>
  );
}
