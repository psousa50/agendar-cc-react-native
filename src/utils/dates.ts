import moment from "moment"

type DateStringBrand = { DateString: "" }

export type DateString = string & DateStringBrand

function validDateOnly(d: string): d is DateString {
  return moment(d, "YYYY-MM-DD", true).isValid()
}

export const toDateOnly = (d: Date | string | undefined): DateString | undefined =>
  d
    ? typeof d === "string"
      ? validDateOnly(d)
        ? d
        : undefined
      : (d.toISOString().substr(0, 10) as DateString)
    : undefined

export const toExistingDateOnly = (d: Date | string): DateString =>
  typeof d === "string" ? (d as DateString) : (d.toISOString().substr(0, 10) as DateString)

export const toMaybeDate = (d: DateString | undefined) => (d ? new Date(d) : undefined)
export const toDate = (d: DateString) => new Date(d)

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

export const createDateRange = (startDate: Date, endDate: Date) => {
  const nrDays = calcDiffDays(startDate, endDate) + 1
  const startAt = moment(startDate)
    .startOf("day")
    .toDate()
  return nrDays > 0 ? new Array(nrDays).fill(startDate).map((_, i) => addDays(startAt, i)) : []
}
