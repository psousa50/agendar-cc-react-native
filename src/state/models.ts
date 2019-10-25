import { GpsLocation, TimeSlot } from "../irnTables/models"
import { i18n } from "../localization/i18n"
import { DateString } from "../utils/dates"

export interface DatePeriod {
  endDate?: DateString
  startDate?: DateString
}

export interface TimePeriod {
  endTime?: TimeSlot
  startTime?: TimeSlot
}

export type Region = "Acores" | "Continente" | "Madeira"

export interface IrnTableFilterLocation {
  countyId?: number
  distanceRadiusKm?: number
  districtId?: number
  gpsLocation?: GpsLocation
  placeName?: string
  region?: Region
}

export interface IrnTableFilterDateTime {
  date?: DateString
  endDate?: DateString
  endTime?: TimeSlot
  onlyOnSaturdays?: boolean
  startDate?: DateString
  startTime?: TimeSlot
  timeSlot?: TimeSlot
}

export interface IrnTableRefineFilterLocation {
  countyId?: number
  districtId?: number
  placeName?: string
}

export interface IrnTableRefineFilter extends IrnTableRefineFilterLocation {
  date?: DateString
  timeSlot?: TimeSlot
}

export interface IrnTableFilter extends IrnTableFilterLocation, IrnTableFilterDateTime {
  serviceId?: number
}

export interface TimeSlotsFilter {
  endTime?: TimeSlot
  startTime?: TimeSlot
  timeSlot?: TimeSlot
}

export const allRegions: Region[] = ["Continente", "Acores", "Madeira"]
type RegionNames = {
  [k: string]: string
}
export const regionNames: RegionNames = {
  ["Continente"]: i18n.t("Regions.Mainland"),
  ["Acores"]: i18n.t("Regions.Azores"),
  ["Madeira"]: i18n.t("Regions.Madeira"),
}
