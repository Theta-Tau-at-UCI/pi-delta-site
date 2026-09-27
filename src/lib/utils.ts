import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * `cn`, clsx + tailwind-merge. Resolves conflicting Tailwind utilities so the
 * last one wins (e.g. cn('p-2', cond && 'p-4')). Used by the React-island
 * components ported from the 21st.dev / Magic UI ecosystem, which expect it.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
