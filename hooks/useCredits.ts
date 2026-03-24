"use client";

import { useState, useEffect, useCallback } from "react";
import { getCredits, deductCredits, addCredits } from "@/lib/credits";

export function useCredits() {
  const [credits, setCreditsState] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCreditsState(getCredits());
  }, []);

  const deduct = useCallback(async (amount: number): Promise<boolean> => {
    const ok = deductCredits(amount);
    if (ok) setCreditsState(getCredits());
    return ok;
  }, []);

  const refund = useCallback(async (amount: number) => {
    addCredits(amount);
    setCreditsState(getCredits());
  }, []);

  const refresh = useCallback(async () => {
    setCreditsState(getCredits());
  }, []);

  return { credits, mounted, loading: !mounted, deduct, refund, refresh };
}
