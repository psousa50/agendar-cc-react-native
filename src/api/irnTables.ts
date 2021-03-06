import { isNil, keys } from "ramda"
import { IrnTableMatchResult } from "../state/irnTablesSlice"
import { IrnTableApiFilter } from "../state/models"
import { fetchJson } from "../utils/fetch"
import { apiUrl } from "./config"
import { fromBoolean, fromDateOnly, fromNumber, fromTimeSlot } from "./utils"

const buildParams = (fieldValues: {}) => {
  const p = keys(fieldValues).reduce(
    (acc, key) => (isNil(fieldValues[key]) ? acc : `${acc}${acc === "" ? "" : "&"}${key}=${fieldValues[key]}`),
    "",
  )

  return p.length > 0 ? `?${p}` : ""
}
const buildIrnTablesParams = (params: IrnTableApiFilter) =>
  buildParams({
    countyId: fromNumber(params.countyId),
    date: fromDateOnly(params.date),
    distanceRadiusKm: fromNumber(params.distanceRadiusKm),
    districtId: fromNumber(params.districtId),
    endDate: fromDateOnly(params.endDate),
    endTime: fromTimeSlot(params.endTime),
    lat: params.gpsLocation && fromNumber(params.gpsLocation.latitude),
    lng: params.gpsLocation && fromNumber(params.gpsLocation.longitude),
    onlyOnSaturdays: fromBoolean(params.onlyOnSaturdays),
    placeName: params.placeName,
    region: params.region,
    selectedDate: fromDateOnly(params.selected.date),
    selectedDistrictId: fromNumber(params.selected.districtId),
    selectedCountyId: fromNumber(params.selected.countyId),
    selectedPlaceName: params.selected.placeName,
    selectedTimeSlot: params.selected.timeSlot,
    serviceId: fromNumber(params.serviceId),
    startDate: fromDateOnly(params.startDate),
    startTime: fromTimeSlot(params.startTime),
  })

export const fetchIrnTableMatch = (params: IrnTableApiFilter) =>
  fetchJson<IrnTableMatchResult>(`${apiUrl}/irnTableMatch${buildIrnTablesParams(params)}`)
