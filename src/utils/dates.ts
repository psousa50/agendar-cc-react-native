import moment from "moment"

export const addDays = (date: Date, days: number) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000)

export const diffDays = (d1: Date, d2: Date) =>
  moment(d2)
    .startOf("day")
    .diff(moment(d1).startOf("day"), "days")

export const datesEqual = (d1: Date, d2: Date) =>
  moment(d1)
    .startOf("day")
    .isSame(moment(d2).startOf("day"))

export const createDateRange = (startDate: Date, endDate: Date) => {
  const nrDays = diffDays(startDate, endDate) + 1
  return nrDays > 0 ? new Array(nrDays).fill(startDate).map((_, i) => addDays(startDate, i)) : []
}
