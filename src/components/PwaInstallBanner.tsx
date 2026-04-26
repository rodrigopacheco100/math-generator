"use client";

import { usePwaInstall } from "@/lib/usePwaInstall";

export function PwaInstallBanner() {
  const { showPrompt, install, dismiss } = usePwaInstall();

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-violet-500 text-white p-4 flex items-center justify-between z-50">
      <div className="flex-1">
        <p className="font-medium">Instalar MathGen</p>
        <p className="text-sm opacity-80">Adicione à tela inicial</p>
      </div>
      <div className="flex gap-2">
        <button onClick={dismiss} className="px-3 py-2 text-sm opacity-80">
          Não
        </button>
        <button
          onClick={install}
          className="px-3 py-2 bg-white text-violet-500 rounded-lg text-sm font-medium"
        >
          Instalar
        </button>
      </div>
    </div>
  );
}