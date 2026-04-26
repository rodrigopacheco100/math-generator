"use client";

import { useEffect } from "react";

export function PwaInitializer() {
  useEffect(() => {
    navigator.serviceWorker.register("/sw.js").catch(console.error);
  }, []);

  return null;
}
