export const PLAN_LIMITS = {
  free: { maxCategories: 1, maxProducts: 3 },
  premium: { maxCategories: Infinity, maxProducts: Infinity },
} as const;

export type Plan = keyof typeof PLAN_LIMITS;

export function planLabel(plan: string): string {
  return plan === "premium" ? "Premium" : "Ücretsiz";
}