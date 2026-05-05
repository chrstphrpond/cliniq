"use client";

import { useReducedMotion } from "motion/react";

export const easings = {
  primary: [0.22, 1, 0.36, 1] as const,
  secondary: [0.4, 0, 0.2, 1] as const,
};

export const durations = {
  micro: 0.12,
  short: 0.2,
  medium: 0.32,
  long: 0.48,
} as const;

export function toMs(seconds: number): number {
  return Math.round(seconds * 1000);
}

export function useReducedMotionSafe<T>(animated: T, reduced: T): T {
  const prefersReduced = useReducedMotion();
  return prefersReduced ? reduced : animated;
}
