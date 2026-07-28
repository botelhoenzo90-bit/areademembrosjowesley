export const PREMIUM_LOCK_DAYS = 0;

export function unlockDateFrom(createdAt?: string | null): Date | null {
  if (!createdAt) return null;
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return null;
  return new Date(d.getTime() + PREMIUM_LOCK_DAYS * 24 * 60 * 60 * 1000);
}

// Módulo liberado para todos — sem bloqueio por tempo.
export function isLocked(_unlockAt: Date | null): boolean {
  return false;
}

export function countdownLabel(unlockAt: Date | null): string {
  if (!unlockAt) return "";
  const ms = unlockAt.getTime() - Date.now();
  if (ms <= 0) return "Liberado";
  const totalMin = Math.floor(ms / 60000);
  const d = Math.floor(totalMin / (60 * 24));
  const h = Math.floor((totalMin % (60 * 24)) / 60);
  const m = totalMin % 60;
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}min`;
  return `${m}min`;
}
