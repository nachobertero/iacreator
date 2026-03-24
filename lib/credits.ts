// ─── Credit system (localStorage-based for MVP, Supabase later) ──

const CREDITS_KEY = "aicreator_credits";
const FREE_STARTER_CREDITS = 50; // free credits for new users

export function getCredits(): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem(CREDITS_KEY);
  if (stored === null) {
    // First visit → give free starter credits
    setCredits(FREE_STARTER_CREDITS);
    return FREE_STARTER_CREDITS;
  }
  return parseInt(stored, 10) || 0;
}

export function setCredits(amount: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CREDITS_KEY, String(amount));
}

export function deductCredits(amount: number): boolean {
  const current = getCredits();
  if (current < amount) return false;
  setCredits(current - amount);
  return true;
}

export function addCredits(amount: number): void {
  setCredits(getCredits() + amount);
}

export function hasEnoughCredits(amount: number): boolean {
  return getCredits() >= amount;
}

// ─── Credit packs ─────────────────────────────────────────────────
export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price: number;
  pricePerCredit: number;
  bonus?: string;
  popular?: boolean;
}

export const CREDIT_PACKS: CreditPack[] = [
  { id: "starter", name: "Starter", credits: 90, price: 9, pricePerCredit: 0.10 },
  { id: "pro", name: "Pro", credits: 200, price: 19, pricePerCredit: 0.095, bonus: "+5% bonus" },
  { id: "creator", name: "Creator", credits: 430, price: 39, pricePerCredit: 0.091, bonus: "+20% bonus", popular: true },
];

// ─── Format helpers ───────────────────────────────────────────────
export function formatCredits(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
