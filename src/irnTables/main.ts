import { flatten, isNil, sort, uniq } from "ramda"
import { IrnPlacesProxy } from "../state/irnPlacesSlice"
import { IrnTableFilter, IrnTableRefineFilter, TimeSlotsFilter } from "../state/models"
import { min } from "../utils/collections"
import { DateOnly } from "../utils/dates"
import { filterTimeSlots } from "../utils/filters"
import { getClosestLocation } from "../utils/location"
import {
  GpsLocation,
  IrnPlace,
  IrnPlaces,
  IrnRepositoryTable,
  IrnRepositoryTables,
  IrnTableResult,
  TimeSlot,
} from "./models"

export const sortTimes = (t1: TimeSlot, t2: TimeSlot) => t1.localeCompare(t2)

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

export const getIrnTablesByClosestPlace = (irnPlacesProxy: IrnPlacesProxy) => (
  irnTables: IrnRepositoryTables,
  location?: GpsLocation,
) => {
  const irnPlaces = irnTables
    .map(t => t.placeName)
    .map(irnPlacesProxy.getIrnPlace)
    .filter(p => !!p) as IrnPlaces

  const closest = location ? getClosestLocation(irnPlaces)(location) : undefined
  const closestIrnPlace = closest ? closest.location : irnPlaces[0]

  const irnTablesByClosestPlace = irnTables.filter(t => t.placeName === closestIrnPlace.name)

  return { closestIrnPlace, irnTablesByClosestPlace }
}

const getOneIrnTableResult = (
  date: DateOnly,
  irnPlace: IrnPlace,
  irnTables: IrnRepositoryTables,
  timeSlotsFilter: TimeSlotsFilter,
): IrnTableResult => {
  const timeSlots = sort(sortTimes, flatten(irnTables.map(t => t.timeSlots))).filter(filterTimeSlots(timeSlotsFilter))
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

export const selectOneIrnTableResultByClosestDate = (irnPlacesProxy: IrnPlacesProxy) => (
  irnTables: IrnRepositoryTables,
  location?: GpsLocation,
  timeSlotsFilter: TimeSlotsFilter = {},
) => {
  if (irnTables.length === 0) {
    return undefined
  }

  const { closestDate, irnTablesByClosestDate } = getIrnTablesByClosestDate(irnTables)

  const { closestIrnPlace, irnTablesByClosestPlace } = getIrnTablesByClosestPlace(irnPlacesProxy)(
    irnTablesByClosestDate,
    location,
  )

  return getOneIrnTableResult(closestDate, closestIrnPlace, irnTablesByClosestPlace, timeSlotsFilter)
}

export const selectOneIrnTableResultByClosestPlace = (irnPlacesProxy: IrnPlacesProxy) => (
  irnTables: IrnRepositoryTables,
  location: GpsLocation,
  timeSlotsFilter: TimeSlotsFilter,
) => {
  if (irnTables.length === 0) {
    return undefined
  }

  const { closestIrnPlace, irnTablesByClosestPlace } = getIrnTablesByClosestPlace(irnPlacesProxy)(irnTables, location)

  const { closestDate, irnTablesByClosestDate } = getIrnTablesByClosestDate(irnTablesByClosestPlace)

  return getOneIrnTableResult(closestDate, closestIrnPlace, irnTablesByClosestDate, timeSlotsFilter)
}

export const byRefineFilter = ({ countyId, date, districtId, placeName, timeSlot }: IrnTableRefineFilter) => (
  irnTable: IrnRepositoryTable,
) => {
  return (
    (isNil(districtId) || irnTable.districtId === districtId) &&
    (isNil(countyId) || irnTable.countyId === countyId) &&
    (isNil(placeName) || irnTable.placeName === placeName) &&
    (isNil(date) || irnTable.date === date) &&
    (isNil(timeSlot) || irnTable.timeSlots.includes(timeSlot))
  )
}

export const normalizeFilter = (filter: IrnTableFilter) => {
  const { startDate, endDate, startTime, endTime } = filter
  const swapDates = startDate && endDate ? startDate > endDate : false
  const swapTimes = startTime && endTime ? startTime > endTime : false
  return {
    ...filter,
    startDate: swapDates ? endDate : startDate,
    endDate: swapDates ? startDate : endDate,
    startTime: swapTimes ? endTime : startTime,
    endTime: swapTimes ? startTime : endTime,
  }
}
