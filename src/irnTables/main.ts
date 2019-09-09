import { uniq } from "ramda"
import {
  IrnRepositoryTable,
  IrnRepositoryTables,
  IrnTableLocation,
  IrnTableLocations,
  IrnTableSchedule,
  IrnTableSchedules,
  Time,
} from "./models"

const mergeTimes = (times1: Time[], times2: Time[]) => uniq([...times1, ...times2])

const mergeSchedules = (schedules: IrnTableSchedules, schedule: IrnTableSchedule) => {
  const dateIndex = schedules.findIndex(s => s.date === schedule.date)
  return dateIndex >= 0
    ? schedules.map((d, i) => ({
        ...d,
        ...(i === dateIndex ? { times: mergeTimes(d.times, schedule.times) } : {}),
      }))
    : [...schedules, schedule]
}

const match = (irnTable: IrnRepositoryTable) => (irnTableLocation: IrnTableLocation) =>
  irnTableLocation.serviceId === irnTable.serviceId &&
  irnTableLocation.county.districtId === irnTable.county.districtId &&
  irnTableLocation.county.countyId === irnTable.county.countyId &&
  irnTableLocation.locationName === irnTable.locationName

const merge = (irnTableLocations: IrnTableLocations, irnTable: IrnRepositoryTable): IrnTableLocations => {
  const matchingTableIndex = irnTableLocations.findIndex(match(irnTable))
  return matchingTableIndex >= 0
    ? irnTableLocations.map((t, i) => ({
        ...t,
        ...(i === matchingTableIndex
          ? { schedules: mergeSchedules(t.schedules, { date: irnTable.date, times: irnTable.times }) }
          : {}),
      }))
    : [
        ...irnTableLocations,
        {
          serviceId: irnTable.serviceId,
          county: irnTable.county,
          locationName: irnTable.locationName,
          address: irnTable.address,
          postalCode: irnTable.postalCode,
          phone: irnTable.phone,
          schedules: [
            {
              date: irnTable.date,
              times: irnTable.times,
            },
          ],
        },
      ]
}

export const mergeIrnTables = (irnTables: IrnRepositoryTables): IrnTableLocations =>
  irnTables.reduce((acc, cur) => merge(acc, cur), [] as IrnTableLocations)

export const sortTimes = (t1: Time, t2: Time) => t1.localeCompare(t2)
