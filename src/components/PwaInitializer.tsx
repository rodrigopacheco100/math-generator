"use client";

import { useEffect } from "react";

export function PwaInitializer() {
  useEffect(() => {
    if (typeof window === "undefined" || !"navigator.serviceWorker") return;
    navigator.serviceWorker.register("/sw.js").catch(console.error);
  }, []);

  return null;
}