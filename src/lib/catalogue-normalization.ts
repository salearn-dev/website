import type { Course } from "./data";

const DELIVERY_MODES = new Set<Course["deliveryMode"]>([
  "Contact",
  "Online",
  "Blended",
  "Workplace",
]);

export function normaliseDeliveryMode(value: string | null): Course["deliveryMode"] {
  return value && DELIVERY_MODES.has(value as Course["deliveryMode"])
    ? (value as Course["deliveryMode"])
    : "Contact";
}

export function isPaidOpportunity(value: string | null) {
  return ["yes", "paid", "true"].includes(value?.trim().toLowerCase() ?? "");
}
