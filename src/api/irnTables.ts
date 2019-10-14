import { isNil, keys } from "ramda"
import { IrnRepositoryTables } from "../irnTables/models"
import { IrnTableFilter } from "../state/models"
import { fetchJson } from "../utils/fetch"
import { apiUrl } from "./config"
import { fromBoolean, fromDate, fromNumber, fromTimeSlot } from "./utils"

const buildParams = (params: IrnTableFilter) => {
  const fieldValues = {
    countyId: fromNumber(params.countyId),
    districtId: fromNumber(params.districtId),
    endDate: fromDate(params.endDate),
    endTime: fromTimeSlot(params.endTime),
    onlyOnSaturdays: fromBoolean(params.onlyOnSaturdays),
    placeName: params.placeName,
    region: params.region,
    serviceId: fromNumber(params.serviceId),
    startDate: fromDate(params.startDate),
    startTime: fromTimeSlot(params.startTime),
  }

  const p = keys(fieldValues).reduce(
    (acc, key) => (isNil(fieldValues[key]) ? acc : `${acc}${acc === "" ? "" : "&"}${key}=${fieldValues[key]}`),
    "",
  )

  return p.length > 0 ? `?${p}` : ""
}

export const fetchIrnTables = (params: IrnTableFilter) =>
  fetchJson<IrnRepositoryTables>(`${apiUrl}/irnTables${buildParams(params)}`)
