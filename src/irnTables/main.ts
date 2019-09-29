import { flatten, keys, mergeDeepWith, sort, uniq } from "ramda"
import { IrnTableFilterState, ReferenceData } from "../state/models"
import { min } from "../utils/collections"
import { datesEqual } from "../utils/dates"
import { getClosestLocation } from "../utils/location"
import { IrnPlace, IrnPlaces, IrnRepositoryTable, IrnRepositoryTables, IrnTableResult, TimeSlot } from "./models"

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

export const getIrnTableResultSummary = (irnTables: IrnRepositoryTables) => {
  const districtIds = uniq(irnTables.map(t => t.districtId))
  const countyIds = uniq(irnTables.map(t => t.countyId))
  const dates = uniq(irnTables.map(t => t.date))
  const irnPlaceNames = uniq(irnTables.map(t => t.placeName))
  const timeSlots = uniq(flatten(irnTables.map(t => t.timeSlots)))

  return {
    districtIds,
    countyIds,
    dates,
    irnPlaceNames,
    timeSlots,
  }
}

const getIrnTablesByClosestDate = (irnTables: IrnRepositoryTables) => {
  const closestDate = min(irnTables.map(t => t.date)) || irnTables[0].date
  const irnTablesByClosestDate = irnTables.filter(t => t.date === closestDate)

  return { closestDate, irnTablesByClosestDate }
}

export const getIrnTablesByClosestPlace = (referenceData: ReferenceData) => (
  irnTables: IrnRepositoryTables,
  irnFilter: IrnTableFilterState,
) => {
  const irnPlaces = irnTables
    .map(t => t.placeName)
    .map(referenceData.getIrnPlace)
    .filter(p => !!p) as IrnPlaces

  const { countyId, districtId, gpsLocation } = irnFilter
  const county = referenceData.getCounty(countyId)
  const district = referenceData.getDistrict(districtId)
  const location = gpsLocation || (county && county.gpsLocation) || (district && district.gpsLocation) || gpsLocation
  const closest = location ? getClosestLocation(irnPlaces)(location) : undefined
  const closestIrnPlace = closest ? closest.location : irnPlaces[0]

  const irnTablesByClosestPlace = irnTables.filter(t => t.placeName === closestIrnPlace.name)

  return { closestIrnPlace, irnTablesByClosestPlace }
}

const getOneIrnTableResult = (date: Date, irnPlace: IrnPlace, irnTables: IrnRepositoryTables) => {
  const timeSlots = sort(sortTimes, flatten(irnTables.map(t => t.timeSlots)))
  const earlierTimeSlot = timeSlots[0]

  const selectedIrnTable = irnTables[0]

  return {
    serviceId: selectedIrnTable.serviceId,
    countyId: selectedIrnTable.countyId,
    date,
    districtId: selectedIrnTable.districtId,
    placeName: irnPlace.name,
    tableNumber: selectedIrnTable.tableNumber,
    timeSlot: earlierTimeSlot,
  }
}

export const selectOneIrnTableResultByClosestDate = (referenceData: ReferenceData) => (
  irnTables: IrnRepositoryTables,
  irnFilter: IrnTableFilterState,
) => {
  if (irnTables.length === 0) {
    return undefined
  }

  const { closestDate, irnTablesByClosestDate } = getIrnTablesByClosestDate(irnTables)

  const { closestIrnPlace, irnTablesByClosestPlace } = getIrnTablesByClosestPlace(referenceData)(
    irnTablesByClosestDate,
    irnFilter,
  )

  return getOneIrnTableResult(closestDate, closestIrnPlace, irnTablesByClosestPlace)
}

export const selectOneIrnTableResultByClosestPlace = (referenceData: ReferenceData) => (
  irnTables: IrnRepositoryTables,
  irnFilter: IrnTableFilterState,
) => {
  if (irnTables.length === 0) {
    return undefined
  }

  const { closestIrnPlace, irnTablesByClosestPlace } = getIrnTablesByClosestPlace(referenceData)(irnTables, irnFilter)

  const { closestDate, irnTablesByClosestDate } = getIrnTablesByClosestDate(irnTablesByClosestPlace)

  return getOneIrnTableResult(closestDate, closestIrnPlace, irnTablesByClosestDate)
}

export const irnTableResultsAreEqual = (r1: IrnTableResult, r2: IrnTableResult) =>
  r1.districtId === r2.districtId && r1.countyId === r2.countyId && r1.placeName === r2.placeName && r1.date === r2.date

export const filterTable = ({
  countyId,
  districtId,
  startDate,
  endDate,
  selectedDate,
  selectedPlaceName,
  selectedTimeSlot,
}: IrnTableFilterState) => (irnTable: IrnRepositoryTable) =>
  (!districtId || irnTable.districtId === districtId) &&
  (!countyId || irnTable.countyId === countyId) &&
  (!startDate || irnTable.date >= startDate) &&
  (!endDate || irnTable.date <= endDate) &&
  (!selectedDate || datesEqual(irnTable.date, selectedDate)) &&
  (!selectedPlaceName || irnTable.placeName === selectedPlaceName) &&
  (!selectedTimeSlot || irnTable.timeSlots.includes(selectedTimeSlot))
