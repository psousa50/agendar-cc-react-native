import moment from "moment"

export const dateOnly = (date: Date) =>
  moment(date)
    .startOf("day")
    .toDate()

export const dateFromTime = (time?: string, defaultTime: string = "") => new Date(`2000-01-01T${time || defaultTime}`)

export const addDays = (date: Date, days: number) =>
  moment(date)
    .add(days, "days")
    .toDate()

export const calcDiffDays = (d1: Date, d2: Date) =>
  moment(d2)
    .startOf("day")
    .diff(moment(d1).startOf("day"), "days")

export const datesAreEqual = (d1: Date, d2: Date) =>
  moment(d1)
    .startOf("day")
    .isSame(moment(d2).startOf("day"))

export const createDateRange = (startDate: Date, endDate: Date) => {
  const nrDays = calcDiffDays(startDate, endDate) + 1
  const startAt = moment(startDate)
    .startOf("day")
    .toDate()
  return nrDays > 0 ? new Array(nrDays).fill(startDate).map((_, i) => addDays(startAt, i)) : []
}
