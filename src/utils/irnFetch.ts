import { isNil, keys } from "ramda"
import { Counties, Districts, IrnPlaces, IrnRepositoryTables, IrnServices } from "../irnTables/models"
import { IrnTableFilter } from "../state/models"
import { config } from "./config"
import { fetchJson } from "./fetch"

const HOST = config.irnUrl
const PORT = config.irnPort
const host = `${HOST}${PORT ? `:${PORT}` : ""}`
const api = `${host}/api/v1`

const fromNumber = (value?: number) => (value ? value.toString() : undefined)
const fromDate = (value?: Date) => (value ? value.toISOString().substr(0, 10) : undefined)
const fromBoolean = (value?: boolean) => (value ? "Y" : undefined)
const fromTimeSlot = (value?: string) => value

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

export const fetchIrnServices = () => fetchJson<IrnServices>(`${api}/irnServices`)
export const fetchDistricts = () => fetchJson<Districts>(`${api}/districts`)
export const fetchCounties = (districtId?: number) =>
  fetchJson<Counties>(`${api}/counties${isNil(districtId) ? "" : `?districtId=${districtId}`}`)
export const fetchIrnPlaces = () => fetchJson<IrnPlaces>(`${api}/irnPlaces`)
export const fetchIrnTables = (params: IrnTableFilter) =>
  fetchJson<IrnRepositoryTables>(`${api}/irnTables${buildParams(params)}`)
