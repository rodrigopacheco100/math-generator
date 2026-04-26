"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { LogoutButton } from "@/components/LogoutButton";
import { OperationCard } from "@/components/OperationCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTRPC } from "@/trpc/client";

type Period = "daily" | "weekly" | "monthly";

interface StatsClientProps {
  userName: string;
  userImage: string | null;
}

export function StatsClient({ userName, userImage }: StatsClientProps) {
  const [period, setPeriod] = useState<Period>("daily");
  const [menuOpen, setMenuOpen] = useState(false);
  const trpc = useTRPC();

  const { data: stats, isLoading } = useQuery(
    trpc.stats.getStats.queryOptions({ period }),
  );

  const periodComparisonLabels: Record<Period, string> = {
    daily: "dia",
    weekly: "semana",
    monthly: "mês",
  };

  return (
    <main className="min-h-full bg-gray-50">
      <header className="bg-white px-5 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Período:</span>
          <Select
            value={period}
            onValueChange={(value: string) => setPeriod(value as Period)}
          >
            <SelectTrigger className="w-auto h-auto p-0 border-none bg-transparent shadow-none text-sm font-medium text-gray-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Diário</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="px-5 py-4 flex flex-col gap-4 md:flex-row md:flex-wrap md:gap-4">
        {isLoading ? (
          <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-2xl h-28 animate-pulse w-full md:w-auto md:flex-1 md:min-w-56 md:max-w-sm"
              />
            ))}
          </div>
        ) : stats ? (
          stats.operations.map((op) => (
            <OperationCard
              key={op.operation}
              stats={op}
              periodLabel={periodComparisonLabels[period]}
            />
          ))
        ) : null}
      </div>
    </main>
  );
}