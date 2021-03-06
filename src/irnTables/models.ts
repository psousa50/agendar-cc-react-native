import { Region } from "../state/models"
import { DateString } from "../utils/dates"

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

export interface DistrictAndCounty {
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
  date: DateString
  districtId: number
  placeName: string
  region: string
  serviceId: number
  tableNumber: string
  timeSlots: TimeSlot[]
}
export type IrnRepositoryTables = IrnRepositoryTable[]
