import moment from "moment"

import { County, District, TimeSlot } from "../irnTables/models"
import { i18n } from "../localization/i18n"
import { calcDiffDays, dateFromTime } from "./dates"

const dayNames = ["Hoje", "Amanhã", "Depois de Amanhã"]

export const formatDateLocale = (date: Date) => {
  // momentLoc.locale("pt")
  // return momentLoc(date).format("LL")
  return i18n.toTime("date.formats.long", date)
}

export const formatDateYYYYMMDD = (date: Date) => moment(date).format("YYYY-MM-DD")

export const formatDate = (date?: Date, defaultDate: string = "--") => {
  if (date) {
    const diffDays = calcDiffDays(new Date(Date.now()), date)
    return diffDays >= 0 && diffDays <= 2 ? dayNames[diffDays] : formatDateLocale(date)
  } else {
    return defaultDate
  }
}

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
