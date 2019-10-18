import { pipe } from "fp-ts/lib/pipeable"
import { map } from "fp-ts/lib/TaskEither"
import { isNil, keys } from "ramda"
import { IrnRepositoryTable, IrnTableResult } from "../irnTables/models"
import { IrnTableFilter } from "../state/models"
import { toDateOnly } from "../utils/dates"
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
const buildIrnTablesParams = (params: IrnTableFilter) =>
  buildParams({
    countyId: fromNumber(params.countyId),
    districtId: fromNumber(params.districtId),
    endDate: fromDateOnly(params.endDate),
    endTime: fromTimeSlot(params.endTime),
    onlyOnSaturdays: fromBoolean(params.onlyOnSaturdays),
    placeName: params.placeName,
    region: params.region,
    serviceId: fromNumber(params.serviceId),
    startDate: fromDateOnly(params.startDate),
    startTime: fromTimeSlot(params.startTime),
  })

type IrnRepositoryTableJSON = IrnRepositoryTable

const transformTable = (irnTable: IrnRepositoryTableJSON) =>
  ({ ...irnTable, date: toDateOnly(new Date(irnTable.date)) } as IrnRepositoryTable)

const transformTables = (irnTables: unknown) => (irnTables as IrnRepositoryTableJSON[]).map(transformTable)
export const fetchIrnTables = (params: IrnTableFilter) =>
  pipe(
    fetchJson(`${apiUrl}/irnTables${buildIrnTablesParams(params)}`),
    map(transformTables),
  )

const buildIrnTablesRequestOptionsParams = (params: IrnTableResult) =>
  buildParams({
    countyId: fromNumber(params.countyId),
    districtId: fromNumber(params.districtId),
    date: fromDateOnly(params.date),
    serviceId: fromNumber(params.serviceId),
  })

export interface IrnTableResultRequestOptions {
  body: string
  headers: {}
  method: string
}

export const fetchIrnTablesScheduleHtml = (params: IrnTableResult) =>
  fetchJson<string>(`${apiUrl}/irnTableScheduleHtml${buildIrnTablesRequestOptionsParams(params)}`)
