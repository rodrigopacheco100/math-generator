"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const modules: Module[] = [
  {
    id: "inteiros",
    name: "Operações com Números Inteiros",
    icon: "📐",
    operations: [
      { name: "Soma", href: "/math/soma", symbol: "+" },
      { name: "Subtração", href: "/math/subtracao", symbol: "−" },
      { name: "Multiplicação", href: "/math/multiplicacao", symbol: "×" },
      { name: "Divisão", href: "/math/divisao", symbol: "÷" },
    ],
  },
  {
    id: "geometria",
    name: "Geometria",
    icon: "🔒",
    locked: true,
    operations: [
      {
        name: "Figuras Planas",
        href: "/geometria/figuras",
        symbol: "🔒",
        locked: true,
      },
      {
        name: "Áreas e Perímetros",
        href: "/geometria/areas",
        symbol: "🔒",
        locked: true,
      },
    ],
  },
];

interface Operation {
  name: string;
  href: string;
  symbol: string;
  locked?: boolean;
}

interface Module {
  id: string;
  name: string;
  icon: string;
  locked?: boolean;
  operations: Operation[];
}

interface AppMenuProps {
  variant: "mobile" | "sidebar";
  onClose?: () => void;
}

export function AppMenu({ variant, onClose }: AppMenuProps) {
  const pathname = usePathname();

  const containerClass = cn(
    "flex flex-col",
    variant === "mobile"
      ? "h-full"
      : "h-full bg-gray-50 border-r border-gray-200",
  );

  const triggerClass = cn(
    "group w-full flex items-center justify-between transition-colors",
    variant === "mobile"
      ? "px-4 py-4 data-[state=open]:bg-gray-50"
      : "px-3 py-4 text-sm font-medium data-[state=open]:bg-gray-100",
    variant === "mobile" ? "text-gray-800" : "text-gray-700",
  );

  const contentClass = cn(
    "flex flex-col overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    variant === "sidebar" && "py-1",
  );

  const separatorClass =
    variant === "sidebar" ? "h-px bg-gray-200 mx-3" : "h-px bg-gray-100";

  const titleClass =
    variant === "sidebar" ? "text-lg font-bold text-gray-800" : undefined;

  if (variant === "mobile") {
    return (
      <div className={containerClass}>
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            type="button"
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 w-full px-4 py-4",
            pathname === "/"
              ? "bg-violet-100 text-violet-700"
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          <span className="w-6 text-center">🏠</span>
          <span className="font-medium">Início</span>
        </Link>

        <Accordion type="multiple" className="flex-1 overflow-y-auto">
          {modules.map((module, moduleIndex) => (
            <AccordionItem key={module.id} value={module.id}>
              <AccordionTrigger
                disabled={module.locked}
                hideIcon={module.locked}
                className={cn(triggerClass, module.locked && "opacity-50")}
              >
                <span className="text-base w-6 text-center">{module.icon}</span>
                <span className="flex-1 text-left">{module.name}</span>
              </AccordionTrigger>
              <AccordionContent className={contentClass}>
                <div className="flex flex-col">
                  {module.operations.map((op, opIndex) => (
                    <Link
                      key={op.name}
                      href={op.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50",
                        pathname === op.href && "bg-violet-50 text-violet-600",
                        opIndex !== module.operations.length - 1 && "border-b border-gray-100",
                      )}
                    >
                      <span className="w-6 text-center font-bold">{op.symbol}</span>
                      <span className="flex-1 text-left">{op.name}</span>
                    </Link>
                  ))}
                </div>
              </AccordionContent>
              {moduleIndex !== modules.length - 1 && (
                <div className={separatorClass} />
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    );
  }

  return (
    <aside className={containerClass}>
      <div className="p-4 border-b border-gray-200">
        <h1 className={titleClass}>Math Generator</h1>
      </div>

      <Link
        href="/"
        className={cn(
          "flex items-center gap-3 w-full px-3 py-4",
          pathname === "/"
            ? "bg-violet-100 text-violet-700"
            : "text-gray-700 hover:bg-gray-100"
        )}
      >
        <span className="w-6 text-center">🏠</span>
        <span className="text-sm font-medium">Início</span>
      </Link>

      <Accordion type="multiple" className="flex-1 overflow-y-auto">
        {modules.map((module, moduleIndex) => (
          <AccordionItem key={module.id} value={module.id}>
            <AccordionTrigger
              disabled={module.locked}
              hideIcon={module.locked}
              className={cn(
                triggerClass,
                "font-medium text-sm",
                module.locked
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100",
              )}
            >
              <span className="w-6 text-center">{module.icon}</span>
              <span className="flex-1 text-left">{module.name}</span>
            </AccordionTrigger>
            <AccordionContent className={contentClass}>
              <div className="flex flex-col">
                {module.operations.map((op, opIndex) => (
                  <Link
                    key={op.name}
                    href={op.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-gray-100",
                      pathname === op.href && "bg-violet-500 text-white",
                      opIndex !== module.operations.length - 1 && "border-b border-gray-100",
                    )}
                  >
                    <span className="w-6 text-center font-bold">{op.symbol}</span>
                    <span className="flex-1 text-left">{op.name}</span>
                  </Link>
                ))}
              </div>
            </AccordionContent>
            {moduleIndex !== modules.length - 1 && (
              <div className={separatorClass} />
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </aside>
  );
}