import { uniq } from "ramda"
import { mergeCollection, mergeIntoCollection } from "../utils/collections"
import {
  DaySchedule,
  IrnRepositoryTable,
  IrnTableDateSchedules,
  IrnTableLocationSchedules,
  LocationSchedule,
  TimeSlot,
} from "./models"

const mergeSchedulesByDate = mergeIntoCollection(
  (ts1: DaySchedule) => (ts2: DaySchedule) => ts1.date === ts2.date,
  (ts1, ts2?) => ({
    ...ts1,
    timeSlots: uniq([...ts1.timeSlots, ...(ts2 ? ts2.timeSlots : [])]),
  }),
)

const matchByLocation = (irnTable: IrnRepositoryTable) => (irnTableLocation: IrnTableLocationSchedules) =>
  irnTableLocation.serviceId === irnTable.serviceId &&
  irnTableLocation.districtId === irnTable.districtId &&
  irnTableLocation.countyId === irnTable.countyId &&
  irnTableLocation.locationName === irnTable.locationName

export const mergeIrnTablesByLocation = mergeCollection(matchByLocation, (irnTable, irnTableLocation) => ({
  serviceId: irnTable.serviceId,
  countyId: irnTable.countyId,
  districtId: irnTable.districtId,
  locationName: irnTable.locationName,
  address: irnTable.address,
  postalCode: irnTable.postalCode,
  phone: irnTable.phone,
  daySchedules: mergeSchedulesByDate(irnTableLocation ? irnTableLocation.daySchedules : [], {
    date: irnTable.date,
    timeSlots: irnTable.timeSlots,
  }),
}))

const mergeSchedulesByLocation = mergeIntoCollection(
  (ts1: LocationSchedule) => (ts2: LocationSchedule) => ts1.locationName === ts2.locationName,
  (ts1, ts2?) => ({
    ...ts1,
    timeSlots: uniq([...ts1.timeSlots, ...(ts2 ? ts2.timeSlots : [])]),
  }),
)

const matchByDate = (irnTable: IrnRepositoryTable) => (irnTableDate: IrnTableDateSchedules) =>
  irnTableDate.serviceId === irnTable.serviceId &&
  irnTableDate.districtId === irnTable.districtId &&
  irnTableDate.countyId === irnTable.countyId &&
  irnTableDate.date === irnTable.date

export const mergeIrnTablesByDate = mergeCollection(matchByDate, (irnTable, irnTableLocation) => ({
  serviceId: irnTable.serviceId,
  countyId: irnTable.countyId,
  districtId: irnTable.districtId,
  date: irnTable.date,
  address: irnTable.address,
  postalCode: irnTable.postalCode,
  phone: irnTable.phone,
  locationSchedules: mergeSchedulesByLocation(irnTableLocation ? irnTableLocation.locationSchedules : [], {
    locationName: irnTable.locationName,
    timeSlots: irnTable.timeSlots,
  }),
}))

export const sortTimes = (t1: TimeSlot, t2: TimeSlot) => t1.localeCompare(t2)
