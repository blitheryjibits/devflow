import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { techMap } from "@/constants/techMap";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDeviconsClassName = (techName: string) => {
  const normalizedTechName = techName.replace(/[ .]/g, "").toLocaleLowerCase();

  return techMap[normalizedTechName] ? `${techMap[normalizedTechName]} colored` : "devicon-devicon-plain";
};

export const getTimeStamp = (date: Date): string => {
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000; // seconds

  if (diff < 5) return "just now";
  if (diff < 60) return `${Math.floor(diff)} seconds ago`;

  const minutes = diff / 60;
  if (minutes < 60) return `${Math.floor(minutes)} minutes ago`;

  const hours = minutes / 60;
  if (hours < 24) return `${Math.floor(hours)} hours ago`;

  const days = hours / 24;
  if (days < 7) return `${Math.floor(days)} days ago`;

  const weeks = days / 7;
  if (weeks < 4) return `${Math.floor(weeks)} weeks ago`;

  const months = days / 30; // approx
  if (months < 12) return `${Math.floor(months)} months ago`;

  const years = days / 365; // approx
  return `${Math.floor(years)} years ago`;
};
