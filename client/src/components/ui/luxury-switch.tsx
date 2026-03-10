import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LuxurySwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export function LuxurySwitch({ checked, onCheckedChange, label, className }: LuxurySwitchProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {label && (
        <span className={cn(
          "text-sm tracking-widest uppercase transition-colors duration-300 font-sans",
          checked ? "text-red-400" : "text-zinc-500"
        )}>
          {label}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-500 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
          checked ? "bg-red-500/20 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]" : "bg-white/10 border-white/5 hover:bg-white/15"
        )}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            "pointer-events-none inline-block h-4 w-4 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5 bg-red-400" : "translate-x-0 bg-zinc-400"
          )}
        />
      </button>
    </div>
  );
}
