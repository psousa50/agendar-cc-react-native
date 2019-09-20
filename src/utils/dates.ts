import moment from "moment"

export const datesEqual = (d1: Date, d2: Date) =>
  moment(d1)
    .utc()
    .isSame(moment(d2).utc())
