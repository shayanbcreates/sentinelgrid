import { cn } from "@/lib/cn";
import type { Severity } from "@/types";

const severityStyles: Record<Severity, string> = {
  CRITICAL: "bg-red-900/40 text-threat-critical border-threat-critical/40",
  HIGH: "bg-orange-900/40 text-threat-high border-threat-high/40",
  MEDIUM: "bg-yellow-900/40 text-threat-medium border-yellow-500/40",
  LOW: "bg-green-900/40 text-threat-low border-threat-low/40",
  INFORMATIONAL: "bg-blue-900/40 text-threat-info border-threat-info/40",
};

interface BadgeProps {
  severity: Severity;
  className?: string;
}

export function SeverityBadge({ severity, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border",
        severityStyles[severity],
        className
      )}
    >
      {severity}
    </span>
  );
}
