import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateSlug = (title: string): string => {
  const randomString = Math.random().toString(36).substring(2, 12);
  const sanitizedTitle = title.toLowerCase().replace(/\s+/g, "-");
  const createdDate = new Date().toISOString().split("T")[0];
  const slug = `${sanitizedTitle}${randomString}-${createdDate}`;
  return slug.substring(0, Math.min(slug.length, 30));
};