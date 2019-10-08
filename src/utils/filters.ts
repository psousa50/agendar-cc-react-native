import { isNil } from "ramda"
import { GpsLocation, TimeSlot } from "../irnTables/models"
import { IrnTableFilter, TimeSlotsFilter } from "../state/models"

export const equalCompatible = (filter1: IrnTableFilter, filter2: IrnTableFilter) => (
  field: keyof IrnTableFilter,
  compare: (v1: any, v2: any) => boolean = (v1, v2) => v1 === v2,
) => {
  const f1 = filter1[field]
  const f2 = filter2[field]
  return isNil(f1) || compare(f1, f2)
}

export const rangeCompatible = (filter1: IrnTableFilter, filter2: IrnTableFilter) => (
  startField: keyof IrnTableFilter,
  endField: keyof IrnTableFilter,
) => {
  const sf1 = filter1[startField]
  const ef1 = filter1[endField]
  const sf2 = filter2[startField]
  const ef2 = filter2[endField]
  return (isNil(sf1) || (!isNil(sf2) && sf2 >= sf1)) && (isNil(ef1) || (!isNil(ef2) && ef2 <= ef1))
}

const locationsAreEqual = (location1: GpsLocation, location2: GpsLocation) =>
  location1.latitude === location2.latitude && location1.longitude === location2.longitude

export const filtersAreCompatible = (filter1: IrnTableFilter, filter2: IrnTableFilter) => {
  const eq = equalCompatible(filter1, filter2)
  const rangeEq = rangeCompatible(filter1, filter2)
  return (
    eq("region") &&
    eq("districtId") &&
    eq("countyId") &&
    eq("placeName") &&
    eq("onlyOnSaturdays") &&
    eq("distanceRadiusKm", (d1, d2) => d2 <= d1) &&
    rangeEq("startDate", "endDate") &&
    rangeEq("startTime", "endTime") &&
    eq("gpsLocation", locationsAreEqual)
  )
}

export const filterTimeSlots = ({ endTime, startTime, timeSlot }: TimeSlotsFilter) => (ts: TimeSlot) =>
  (isNil(timeSlot) || ts === timeSlot) && (isNil(startTime) || startTime <= ts) && (isNil(endTime) || endTime >= ts)
