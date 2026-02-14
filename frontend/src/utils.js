import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatINR(amount) {
  if (amount == null || Number.isNaN(Number(amount))) return "₹0"
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Number(amount))
}

export function formatIndianNumber(num) {
  if (num == null || Number.isNaN(Number(num))) return "0"
  return new Intl.NumberFormat("en-IN").format(Number(num))
}
