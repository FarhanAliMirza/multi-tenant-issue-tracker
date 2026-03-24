// API utility for backend base URL
export const API_BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
