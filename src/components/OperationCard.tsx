"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OperationStats {
  operation: string;
  name: string;
  symbol: string;
  current: {
    totalAnswers: number;
    correctAnswers: number;
    accuracy: number;
  };
  previous: {
    totalAnswers: number;
    correctAnswers: number;
    accuracy: number;
  };
  comparison: number;
}

interface OperationCardProps {
  stats: OperationStats;
  periodLabel?: string;
}

export function OperationCard({
  stats,
  periodLabel = "semana",
}: OperationCardProps) {
  const { name, symbol, current, previous, comparison } = stats;

  const comparisonClass = cn(
    "text-xs font-medium",
    comparison > 0 && "text-emerald-600",
    comparison < 0 && "text-red-500",
    comparison === 0 && "text-gray-400",
  );

  const comparisonText =
    comparison > 0
      ? `+${comparison}%`
      : comparison < 0
        ? `${comparison}%`
        : "0%";

  return (
    <Card className="w-full md:w-auto md:flex-1 md:min-w-56 md:max-w-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-800">{symbol}</span>
            <CardTitle className="text-base font-semibold truncate">
              {name}
            </CardTitle>
          </div>
          <span className={comparisonClass}>{comparisonText}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        <div>
          <p className="text-[10px] sm:text-xs text-gray-400 mb-1">
            Este período
          </p>
          <div className="grid grid-cols-3 gap-1 sm:gap-2 text-center">
            <div className="bg-gray-50 rounded-lg p-1.5 sm:p-2">
              <p className="text-base sm:text-lg font-bold text-gray-800">
                {current.totalAnswers}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500">Contas</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-1.5 sm:p-2">
              <p className="text-base sm:text-lg font-bold text-emerald-600">
                {current.correctAnswers}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500">Acertos</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-1.5 sm:p-2">
              <p className="text-base sm:text-lg font-bold text-violet-600">
                {current.accuracy}%
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
                % Acerto
              </p>
            </div>
          </div>
        </div>
        <div>
          <p className="text-[10px] sm:text-xs text-gray-400 mb-1">
            Período anterior ({periodLabel})
          </p>
          <div className="grid grid-cols-3 gap-1 sm:gap-2 text-center">
            <div className="bg-gray-100 rounded-lg p-1.5 sm:p-2">
              <p className="text-base sm:text-lg font-bold text-gray-600">
                {previous.totalAnswers}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400">Contas</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-1.5 sm:p-2">
              <p className="text-base sm:text-lg font-bold text-emerald-500">
                {previous.correctAnswers}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400">Acertos</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-1.5 sm:p-2">
              <p className="text-base sm:text-lg font-bold text-violet-400">
                {previous.accuracy}%
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap">
                % Acerto
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
