"use client";

import { useEffect, useState } from "react";

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    navigator.serviceWorker.register("/sw.js").catch(console.error);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    (deferredPrompt as { prompt: () => Promise<void> }).prompt();
    const { outcome } = await (deferredPrompt as {
      userChoice: Promise<{ outcome: string }>;
    }).userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const dismiss = () => setShowPrompt(false);

  return { showPrompt, install, dismiss };
}