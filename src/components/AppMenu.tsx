"use client";

import { ChevronDownIcon, LockIcon } from "lucide-react";
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
      ? "px-4 py-3 data-[state=open]:bg-gray-50"
      : "px-3 py-2.5 text-sm font-medium data-[state=open]:bg-gray-100",
    variant === "mobile" ? "text-gray-800" : "text-gray-700",
  );

  const labelClass = cn(
    "flex items-center gap-3",
    variant === "sidebar" && "font-medium text-sm",
  );

  const contentClass = cn(
    "flex flex-col overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    variant === "sidebar" && "py-1",
  );

  const itemClass = (isActive: boolean, isLast: boolean) =>
    cn(
      "flex items-center gap-3 transition-colors",
      variant === "mobile"
        ? "px-4 py-3 hover:bg-gray-50"
        : "px-3 py-2 text-sm hover:bg-gray-100",
      isActive
        ? variant === "mobile"
          ? "bg-violet-50 text-violet-600"
          : "bg-violet-500 text-white"
        : "text-gray-800",
      !isLast && "border-b border-gray-100",
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

        <Accordion type="multiple" className="flex-1 overflow-y-auto">
          {modules.map((module, moduleIndex) => (
            <AccordionItem key={module.id} value={module.id}>
              <AccordionTrigger
                disabled={module.locked}
                className={cn(triggerClass, module.locked && "opacity-50")}
              >
                <div className={labelClass}>
                  <span className="text-xl">{module.icon}</span>
                  <span className="font-medium">{module.name}</span>
                </div>
                {module.locked ? (
                  <LockIcon className="size-4 text-gray-400" />
                ) : (
                  <ChevronDownIcon className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                )}
              </AccordionTrigger>
              <AccordionContent className={contentClass}>
                <div className="flex flex-col">
                  {module.operations.map((op, opIndex) => (
                    <Link
                      key={op.name}
                      href={op.href}
                      onClick={onClose}
                      className={itemClass(
                        pathname === op.href,
                        opIndex === module.operations.length - 1,
                      )}
                    >
                      <span className="w-8 text-center font-bold">
                        {op.symbol}
                      </span>
                      <span className="font-medium">{op.name}</span>
                      {op.locked && (
                        <LockIcon className="size-4 text-gray-400 ml-auto" />
                      )}
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

      <Accordion type="multiple" className="flex-1 overflow-y-auto">
        {modules.map((module, moduleIndex) => (
          <AccordionItem key={module.id} value={module.id}>
            <AccordionTrigger
              disabled={module.locked}
              className={cn(
                triggerClass,
                "font-medium text-sm",
                module.locked
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100",
              )}
            >
              <div className={labelClass}>
                <span>{module.icon}</span>
                <span>{module.name}</span>
              </div>
              {module.locked ? (
                <LockIcon className="size-3.5 text-gray-400" />
              ) : (
                <ChevronDownIcon className="size-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
              )}
            </AccordionTrigger>
            <AccordionContent className={contentClass}>
              <div className="flex flex-col">
                {module.operations.map((op, opIndex) => (
                  <Link
                    key={op.name}
                    href={op.href}
                    className={itemClass(
                      pathname === op.href,
                      opIndex === module.operations.length - 1,
                    )}
                  >
                    <span className="w-5 text-center font-bold">
                      {op.symbol}
                    </span>
                    <span>{op.name}</span>
                    {op.locked && (
                      <LockIcon className="size-3.5 text-gray-400 ml-auto" />
                    )}
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
