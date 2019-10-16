import { DateOnly } from "../utils/dates"

export const fromNumber = (value?: number) => (value ? value.toString() : undefined)
export const fromDateOnly = (value?: DateOnly) => value
export const fromBoolean = (value?: boolean) => (value ? "Y" : undefined)
export const fromTimeSlot = (value?: string) => value
