import { KeyButton } from "@/components/ui/key-button";

interface NumberKeyboardProps {
  onKeyPress: (key: string) => void;
  disabled: boolean;
}

export function NumberKeyboard({ onKeyPress, disabled }: NumberKeyboardProps) {
  const keys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["DEL", "0", "OK"],
  ];

  return (
    <div className="flex flex-col gap-2">
      {keys.map((row, i) => (
        <div key={`key_row_${i}`} className="flex gap-2">
          {row.map((key) => (
            <KeyButton
              key={`key_${key}`}
              keyType={key === "DEL" ? "del" : key === "OK" ? "ok" : "number"}
              onClick={() => onKeyPress(key)}
              className="flex-1 h-14 rounded-xl font-semibold text-xl"
              disabled={disabled}
            >
              {key}
            </KeyButton>
          ))}
        </div>
      ))}
    </div>
  );
}
