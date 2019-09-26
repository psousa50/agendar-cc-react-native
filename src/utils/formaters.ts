import moment from "moment"
import momentLoc from "moment-with-locales-es6"

import { County, District, TimeSlot } from "../irnTables/models"
import { calcDiffDays } from "./dates"

const dayNames = ["Hoje", "Amanhã", "Depois de Amanhã"]

export const formatDateLocale = (date: Date) => {
  momentLoc.locale("pt")
  return momentLoc(date).format("LL")
}

export const formatDateYYYYMMDD = (date: Date) => moment(date).format("YYYY-MM-DD")

export const formatDate = (date: Date) => {
  const diffDays = calcDiffDays(new Date(Date.now()), date)
  return diffDays >= 0 && diffDays <= 2 ? dayNames[diffDays] : formatDateLocale(date)
}

const twoDigits = (v: number) => `${v < 10 ? 0 : ""}${v}`

export const formatTimeSlot = (time: TimeSlot) => {
  const date = new Date(`2000-01-01T${time}`)
  return `${twoDigits(date.getHours())}:${twoDigits(date.getMinutes())}`
}

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
  return `${districtName}${countyNamePart}`
}
