import { uniq } from "ramda"
import { mergeCollection, mergeIntoCollection } from "../utils/collections"
import { IrnRepositoryTable, IrnTableLocation, IrnTableSchedule, Time } from "./models"

const mergeSchedules = mergeIntoCollection(
  (ts1: IrnTableSchedule) => (ts2: IrnTableSchedule) => ts1.date === ts2.date,
  (ts1, ts2?) => ({
    ...ts1,
    times: uniq([...ts1.times, ...(ts2 ? ts2.times : [])]),
  }),
)

const matchByLocation = (irnTable: IrnRepositoryTable) => (irnTableLocation: IrnTableLocation) =>
  irnTableLocation.serviceId === irnTable.serviceId &&
  irnTableLocation.county.districtId === irnTable.county.districtId &&
  irnTableLocation.county.countyId === irnTable.county.countyId &&
  irnTableLocation.locationName === irnTable.locationName

export const mergeIrnTablesByLocation = mergeCollection(matchByLocation, (irnTable, irnTableLocation) => ({
  serviceId: irnTable.serviceId,
  county: irnTable.county,
  locationName: irnTable.locationName,
  address: irnTable.address,
  postalCode: irnTable.postalCode,
  phone: irnTable.phone,
  schedules: mergeSchedules(irnTableLocation ? irnTableLocation.schedules : [], {
    date: irnTable.date,
    times: irnTable.times,
  }),
}))

export const sortTimes = (t1: Time, t2: Time) => t1.localeCompare(t2)
