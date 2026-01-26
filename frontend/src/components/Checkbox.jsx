import { Check } from "lucide-react";
import { tw } from "@/utility";

export function Checkbox({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={tw(
        "relative inline-flex items-center cursor-pointer justify-center",
        "h-5 w-5 rounded-sm border-2",
        checked
          ? "bg-blue-600 border-blue-600"
          : "bg-white border-slate-300",
        "transition-colors duration-150 ease-out",
        disabled && "opacity-60 cursor-not-allowed"
      )}
      aria-pressed={checked}
    >
      <Check
        className={tw(
          "h-4 w-4 text-white",
          "transition-all duration-150 ease-out",
          checked
            ? "opacity-100 scale-100"
            : "opacity-0 scale-75"
        )}
        strokeWidth={3}
      />
    </button>
  );
}
