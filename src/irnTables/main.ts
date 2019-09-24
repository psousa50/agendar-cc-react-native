import { keys, mergeDeepWith } from "ramda"
import { IrnRepositoryTable, IrnRepositoryTables, TimeSlot } from "./models"

export const sortTimes = (t1: TimeSlot, t2: TimeSlot) => t1.localeCompare(t2)

export interface IrnTablesByPlace {
  [placeName: string]: IrnRepositoryTables
}

interface IrnTablesByTimeSlotAndPlace {
  [timeSlot: string]: IrnTablesByPlace
}

interface IrnTablesByTimeSlot {
  [timeSlot: string]: IrnRepositoryTables
}

const checkArray = <T>(col?: T[]) => col || []

export const mergeIrnTablesByPlace = (irnTables: IrnRepositoryTables) =>
  irnTables.reduce(
    (acc, irnTable) => ({
      ...acc,
      [irnTable.placeName]: [...checkArray(acc[irnTable.placeName]), irnTable],
    }),
    {} as IrnTablesByPlace,
  )

const mergeByTimeSlot = (irnTable: IrnRepositoryTable) => (
  irnTableByTimeSlot: IrnTablesByTimeSlot,
  timeSlot: TimeSlot,
) => ({
  ...irnTableByTimeSlot,
  [timeSlot]: [...checkArray(irnTableByTimeSlot[timeSlot]), irnTable],
})

const mergeByPlace = (irnTablesByTimeSlot: IrnTablesByTimeSlot) => (
  tsal: IrnTablesByTimeSlotAndPlace,
  timeSlot: string | number,
) => ({
  ...tsal,
  [timeSlot]: mergeIrnTablesByPlace(irnTablesByTimeSlot[timeSlot]),
})

export const mergeIrnTablesByTimeSlotAndPlace = (irnTables: IrnRepositoryTables) =>
  irnTables.reduce(
    (acc, irnTable) => {
      const irnTablesByTimeSlot = irnTable.timeSlots.reduce(mergeByTimeSlot(irnTable), {} as IrnTablesByTimeSlot)
      const irnTableByTimeSlotAndPlace = keys(irnTablesByTimeSlot).reduce(
        mergeByPlace(irnTablesByTimeSlot),
        {} as IrnTablesByTimeSlotAndPlace,
      )

      return mergeDeepWith(
        (t1: IrnRepositoryTables, t2: IrnRepositoryTables) => [...t1, ...t2],
        acc,
        irnTableByTimeSlotAndPlace,
      )
    },
    {} as IrnTablesByTimeSlotAndPlace,
  )
