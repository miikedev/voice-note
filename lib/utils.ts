import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMongoDate(date: Date): string {
  if (!date) return null;
  return date.toLocaleString("en-US", {
    // weekday: "long",   // "Tuesday"
    year: "numeric",   // "2025"
    month: "long",     // "September"
    day: "numeric",    // "16"
    hour: "numeric",   // "11"
    minute: "2-digit", // "35"
    second: "2-digit", // "24"
    hour12: true,      // 12-hour AM/PM
    timeZoneName: "short" // "GMT+6:30"
  });
}