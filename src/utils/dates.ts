import moment from "moment"

const DateStringFormat = "YYYY-MM-DD"
type DateStringBrand = { DateString: "" }

export type DateString = string & DateStringBrand

const validDateString = (d: string): d is DateString => moment(d, DateStringFormat, true).isValid()

export const toDateString = (d: Date | string | undefined): DateString | undefined =>
  d
    ? typeof d === "string"
      ? validDateString(d)
        ? d
        : undefined
      : (moment.utc(d).format(DateStringFormat) as DateString)
    : undefined

export const toExistingDateString = (d: Date | string): DateString =>
  typeof d === "string" ? (d as DateString) : (moment.utc(d).format(DateStringFormat) as DateString)

export const toUtcMaybeDate = (d: DateString | undefined) => (d ? toUtcDate(d) : undefined)
export const toUtcDate = (d: DateString) => moment.utc(d).toDate()
export const currentUtcDateString = () => toExistingDateString(moment.utc().toDate())
export const currentUtcDateTime = () => moment.utc()

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
