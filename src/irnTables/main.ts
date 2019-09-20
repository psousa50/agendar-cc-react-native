import { keys, mergeDeepWith } from "ramda"
import { IrnRepositoryTable, IrnRepositoryTables, TimeSlot } from "./models"

export const sortTimes = (t1: TimeSlot, t2: TimeSlot) => t1.localeCompare(t2)

export interface IrnTablesByLocation {
  [locationName: string]: IrnRepositoryTables
}

interface IrnTablesByTimeSlotAndLocation {
  [timeSlot: string]: IrnTablesByLocation
}

interface IrnTablesByTimeSlot {
  [timeSlot: string]: IrnRepositoryTables
}

const checkArray = <T>(col?: T[]) => col || []

export const mergeIrnTablesByLocation = (irnTables: IrnRepositoryTables) =>
  irnTables.reduce(
    (acc, irnTable) => ({
      ...acc,
      [irnTable.locationName]: [...checkArray(acc[irnTable.locationName]), irnTable],
    }),
    {} as IrnTablesByLocation,
  )

const mergeByTimeSlot = (irnTable: IrnRepositoryTable) => (
  irnTableByTimeSlot: IrnTablesByTimeSlot,
  timeSlot: TimeSlot,
) => ({
  ...irnTableByTimeSlot,
  [timeSlot]: [...checkArray(irnTableByTimeSlot[timeSlot]), irnTable],
})

const mergeByLocation = (irnTablesByTimeSlot: IrnTablesByTimeSlot) => (
  tsal: IrnTablesByTimeSlotAndLocation,
  timeSlot: string | number,
) => ({
  ...tsal,
  [timeSlot]: mergeIrnTablesByLocation(irnTablesByTimeSlot[timeSlot]),
})

export const mergeIrnTablesByTimeSlotAndLocation = (irnTables: IrnRepositoryTables) =>
  irnTables.reduce(
    (acc, irnTable) => {
      const irnTablesByTimeSlot = irnTable.timeSlots.reduce(mergeByTimeSlot(irnTable), {} as IrnTablesByTimeSlot)
      const irnTableByTimeSlotAndLocation = keys(irnTablesByTimeSlot).reduce(
        mergeByLocation(irnTablesByTimeSlot),
        {} as IrnTablesByTimeSlotAndLocation,
      )

      return mergeDeepWith(
        (t1: IrnRepositoryTables, t2: IrnRepositoryTables) => [...t1, ...t2],
        acc,
        irnTableByTimeSlotAndLocation,
      )
    },
    {} as IrnTablesByTimeSlotAndLocation,
  )
