import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge conditional class names and de-duplicate conflicting Tailwind utilities.
 * `cn('px-4', condition && 'px-6')` → 'px-6'
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}