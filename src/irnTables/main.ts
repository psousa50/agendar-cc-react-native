import { flatten, uniq } from "ramda"
import { IrnPlacesProxy } from "../state/irnPlacesSlice"
import { IrnTableFilter } from "../state/models"
import { getClosestLocation } from "../utils/location"
import { GpsLocation, IrnPlaces, IrnRepositoryTables, TimeSlot } from "./models"

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
