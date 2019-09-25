import moment from "moment"

export const addDays = (date: Date, days: number) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000)

export const datesEqual = (d1: Date, d2: Date) =>
  moment(d1)
    .utc()
    .isSame(moment(d2).utc())

export const createDateRange = (startDate: Date, endDate: Date) => {
  const nrDays =
    moment(endDate)
      .utc()
      .diff(moment(startDate).utc(), "days") + 1
  return nrDays > 0 ? new Array(nrDays).fill(startDate).map((_, i) => addDays(startDate, i)) : []
}
