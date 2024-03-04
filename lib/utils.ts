import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createBoardSchema = z.object({
  name: z.string().min(3).max(50),
});

export const generateMessage = (activity: any) => {
  return `.${activity.typeOfActivity} ${activity.itemType} "${activity.itemTitle}"`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: "short", // Abbreviated month name (e.g., "Nov")
    day: "numeric", // Numeric day of the month (e.g., "14")
    year: "numeric", // Numeric year (e.g., "2023")
    hour: "numeric", // Numeric hour (e.g., "10")
    minute: "2-digit", // Numeric minute (e.g., "56")
    hour12: true, // Use 12-hour clock (e.g., "AM" or "PM")
  };

  const formattedDate = date.toLocaleDateString("en-US", options);
  const formattedTime = date.toLocaleTimeString("en-US", options);

  return `${formattedDate}`;
};

export const absoluteUrl = (path: string) => {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
};
