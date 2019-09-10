import moment from "moment-with-locales-es6"
import { Time } from "../irnTables/models"

const dayNames = ["Hoje", "Amanhã", "Depois de Amanhã"]

export const formatLocale = (date: Date) => {
  moment.locale("pt")
  return moment(date).format("LL")
}

export const formatDate = (date: Date) => {
  const diffDays = moment(date).diff(moment.now(), "days")
  return diffDays >= 0 && diffDays <= 2 ? dayNames[diffDays] : formatLocale(date)
}

const t = (v: number) => `${v < 10 ? 0 : ""}${v}`

export const formatTime = (time: Time) => {
  const date = new Date(`2000-01-01T${time}`)
  return `${t(date.getHours())}:${t(date.getMinutes())}`
}

export const properCase = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .split(" ")
    .map(w => `${w[0].toUpperCase()}${w.substring(1)}`)
    .join(" ")
