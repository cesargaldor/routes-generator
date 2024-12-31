import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseOpenAIData(openAIResponse: any) {
  const { start, stops, end } = openAIResponse;

  const waypoints = [
    start.coordinates,
    ...stops.map((stop: any) => stop.coordinates),
    end.coordinates,
  ];

  return waypoints;
}
