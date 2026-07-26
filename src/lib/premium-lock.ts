export const PREMIUM_LOCK_DAYS = 7;
export const PREMIUM_SLUG = "treinamento-premium";

export type PremiumLock = {
  locked: boolean;
  unlockAt: Date | null;
  label: string;
};

/** Calcula o desbloqueio do Treinamento Premium: 7 dias após o cadastro do usuário. */
export function computePremiumLock(createdAt?: string | null): PremiumLock {
  if (!createdAt) return { locked: false, unlockAt: null, label: "" };
  const unlockAt = new Date(new Date(createdAt).getTime() + PREMIUM_LOCK_DAYS * 24 * 60 * 60 * 1000);
  const diff = unlockAt.getTime() - Date.now();
  if (diff <= 0) return { locked: false, unlockAt, label: "" };

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const label =
    days > 0
      ? `Libera em ${days}d ${hours}h`
      : hours > 0
      ? `Libera em ${hours}h ${minutes}min`
      : `Libera em ${minutes}min`;

  return { locked: true, unlockAt, label };
}
