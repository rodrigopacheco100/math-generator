"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { LogoutButton } from "@/components/LogoutButton";
import { OperationCard } from "@/components/OperationCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={userImage || undefined} alt={userName} />
              <AvatarFallback className="text-lg font-semibold">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-xl font-bold text-gray-800">
              Olá, {userName}!
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/settings" className="p-2">
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756  2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </Link>
            <LogoutButton />
          </div>
        </div>
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
