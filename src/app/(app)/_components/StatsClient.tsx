"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTRPC } from "@/client/client";
import { OperationCard } from "@/components/OperationCard";
import { StatsCardSkeleton } from "@/components/StatsCardSkeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Period = "daily" | "weekly" | "monthly";

const periodComparisonLabels: Record<Period, string> = {
  daily: "dia",
  weekly: "semana",
  monthly: "mês",
};

export function StatsClient() {
  const [period, setPeriod] = useState<Period>("daily");
  const trpc = useTRPC();

  const { data: stats, isLoading } = useQuery(
    trpc.stats.getStats.queryOptions({ period }),
  );

  return (
    <main className="min-h-full bg-gray-50">
      <header className="bg-white px-5 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Período:</span>
          <Select
            value={period}
            onValueChange={(v: string) => setPeriod(v as Period)}
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
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
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
