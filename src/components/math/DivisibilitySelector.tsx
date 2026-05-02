interface DivisibilitySelectorProps {
  number: number;
  selectedDivisors: number[];
  onDivisorToggle: (divisor: number) => void;
}

const allDivisorOptions = [2, 3, 4, 5, 6, 8, 9, 10, 100, 1000];

export function DivisibilitySelector({
  number,
  selectedDivisors,
  onDivisorToggle,
}: DivisibilitySelectorProps) {
  // Only show divisors that don't exceed the number
  const divisorOptions = allDivisorOptions.filter(
    (divisor) => divisor <= number,
  );

  return (
    <div className="space-y-3">
      <p className="text-lg font-medium text-gray-800">
        {number} é divisível por quais?
      </p>
      <div className="grid grid-cols-4 gap-2">
        {divisorOptions.map((divisor) => (
          <label
            key={divisor}
            className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedDivisors.includes(divisor)}
              onChange={() => onDivisorToggle(divisor)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="font-medium">{divisor}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
