export const fromNumber = (value?: number) => (value ? value.toString() : undefined)
export const fromDate = (value?: Date) => (value ? value.toISOString().substr(0, 10) : undefined)
export const fromBoolean = (value?: boolean) => (value ? "Y" : undefined)
export const fromTimeSlot = (value?: string) => value
