import moment from "moment"

import { County, District, TimeSlot } from "../irnTables/models"
import { i18n } from "../localization/i18n"
import { dateFromTime, DateString, toUtcDate } from "./dates"

export const formatDateLocale = (date?: DateString) => date && i18n.toTime("date.formats.long", toUtcDate(date))

const twoDigits = (v: number) => `${v < 10 ? 0 : ""}${v}`

export const formatTimeSlot = (time?: TimeSlot, defaultTime: string = "--:--") => {
  if (time) {
    const date = dateFromTime(time)
    return `${twoDigits(date.getHours())}:${twoDigits(date.getMinutes())}`
  } else {
    return defaultTime
  }
}

export const extractTime = (date: Date) => moment(date).format("HH:mm:00")

export const properCase = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .split(" ")
    .map(w => `${w[0].toUpperCase()}${w.substring(1)}`)
    .join(" ")

export const getCountyName = (county?: County, district?: District) => {
  const countyName = county ? properCase(county.name) : ""
  const districtName = district ? properCase(district.name) : ""
  const countyNamePart = countyName ? ` - ${countyName}` : ""
  return district || county ? `${districtName}${countyNamePart}` : ""
}
