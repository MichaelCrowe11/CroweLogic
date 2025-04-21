import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  if (!date) return 'N/A';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj);
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

export function getBaseUrl(): string {
  // In browser, we can use relative path
  if (typeof window !== 'undefined') return '';
  
  // When in a Node.js environment during SSR, determine the URL
  const url = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : process.env.REPLIT_DOMAINS 
      ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
      : 'http://localhost:5000';

  return url;
}

export function generateQRUrl(batchCode: string): string {
  return `${getBaseUrl()}/batch/${batchCode}`;
}
