import { isNil, keys } from "ramda"
import {
  Counties,
  Districts,
  GetTableParams as GetIrnTableParams,
  IrnPlaces,
  IrnRepositoryTables,
  IrnServices,
} from "../irnTables/models"
import { config } from "./config"
import { fetchJson } from "./fetch"

const HOST = config.irnUrl
const PORT = config.irnPort
const host = `${HOST}${PORT ? `:${PORT}` : ""}`
const api = `${host}/api/v1`

const buildParams = (params: {}) => {
  const p = keys(params).reduce(
    (acc, key) => (isNil(params[key]) ? acc : `${acc}${acc === "" ? "" : "&"}${key}=${params[key]}`),
    "",
  )

  return p.length > 0 ? `?${p}` : ""
}

export const fetchIrnServices = () => fetchJson<IrnServices>(`${api}/irnServices`)
export const fetchDistricts = () => fetchJson<Districts>(`${api}/districts`)
export const fetchCounties = (districtId?: number) =>
  fetchJson<Counties>(`${api}/counties${isNil(districtId) ? "" : `?districtId=${districtId}`}`)
export const fetchIrnPlaces = () => fetchJson<IrnPlaces>(`${api}/irnPlaces`)
export const fetchIrnTables = (params: GetIrnTableParams) =>
  fetchJson<IrnRepositoryTables>(`${api}/irnTables${buildParams(params)}`)
