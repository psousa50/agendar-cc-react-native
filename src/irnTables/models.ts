import { Region } from "../state/models"

export type TimeSlot = string

export interface GpsLocation {
  latitude: number
  longitude: number
}
export type IrnService = {
  serviceId: number
  name: string
}
export type IrnServices = IrnService[]

export type District = {
  districtId: number
  region: Region
  name: string
  gpsLocation?: GpsLocation
}
export type Districts = District[]

export type County = {
  districtId: number
  countyId: number
  name: string
  gpsLocation?: GpsLocation
}
export type Counties = County[]

export interface DistrictCounty {
  districtId?: number
  countyId?: number
}
export type IrnPlace = {
  address: string
  countyId: number
  districtId: number
  gpsLocation?: GpsLocation
  name: string
  phone: string
  postalCode: string
}
export type IrnPlaces = IrnPlace[]

export type IrnRepositoryTable = {
  countyId: number
  date: Date
  districtId: number
  placeName: string
  region: string
  serviceId: number
  tableNumber: string
  timeSlots: TimeSlot[]
}
export type IrnRepositoryTables = IrnRepositoryTable[]

export type DaySchedule = {
  date: Date
  timeSlots: TimeSlot[]
}

export type PlaceSchedule = {
  placeName: string
  timeSlots: TimeSlot[]
}

export interface IrnTableGrouped {
  serviceId: number
  districtId: number
  countyId: number
  address: string
  postalCode: string
  phone: string
}

export interface IrnTableLocationSchedules extends IrnTableGrouped {
  placeName: string
  daySchedules: DaySchedule[]
}

export interface IrnTableDateSchedules extends IrnTableGrouped {
  date: Date
  placeSchedules: PlaceSchedule[]
}

export type GetTableParams = Partial<{
  serviceId: number
  districtId: number
  countyId: number
  startDate: Date
  endDate: Date
  startTime: TimeSlot
  endTime: TimeSlot
}>

export interface IrnTableResult {
  serviceId: number
  countyId: number
  districtId: number
  date: Date
  placeName: string
  timeSlot: TimeSlot
  tableNumber: string
}

export interface IrnTableResultSummary {
  districtIds: number[]
  countyIds: number[]
  dates: Date[]
  irnPlaceNames: string[]
  timeSlots: TimeSlot[]
}
