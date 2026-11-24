import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileWarning,
  Info,
  ShieldAlert,
} from 'lucide-react';
import type { ComplaintStatus, SeverityLevel } from '../types/civic';

export function SeverityIndicator({ severity }: { severity: SeverityLevel }) {
  if (severity === 'High') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 whitespace-nowrap">
        <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-red-600" aria-hidden="true" />
        <span>High</span>
      </span>
    );
  }
  if (severity === 'Medium') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 whitespace-nowrap">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" aria-hidden="true" />
        <span>Medium</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 whitespace-nowrap">
      <Info className="w-3.5 h-3.5 shrink-0 text-slate-500" aria-hidden="true" />
      <span>Low</span>
    </span>
  );
}

export function StatusIndicator({ status }: { status: ComplaintStatus }) {
  if (status === 'Fixed') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 whitespace-nowrap">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-teal-600" aria-hidden="true" />
        <span>Fixed</span>
      </span>
    );
  }
  if (status === 'In Progress') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 whitespace-nowrap">
        <Clock className="w-3.5 h-3.5 shrink-0 text-amber-600" aria-hidden="true" />
        <span>In Progress</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-900 whitespace-nowrap">
      <FileWarning className="w-3.5 h-3.5 shrink-0 text-navy-700" aria-hidden="true" />
      <span>Reported</span>
    </span>
  );
}
