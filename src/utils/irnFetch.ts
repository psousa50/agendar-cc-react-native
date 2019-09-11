import { isNil, keys } from "ramda"
import { Counties, Districts, GetTableParams, IrnRepositoryTables } from "../irnTables/models"
import { config } from "./config"
import { fetchJson } from "./fetch"

const HOST = config.irnUrl
const PORT = config.irnPort
const host = `http://${HOST}:${PORT}`
const api = `${host}/api/v1`

const buildParams = (params: {}) => {
  const p = keys(params).reduce((acc, key) => `${acc}&${key}=${params[key]}`, "")

  return p.length > 0 ? `?${p}` : ""
}

export const fetchDistricts = () => fetchJson<Districts>(`${api}/districts`)
export const fetchCountries = (districtId?: number) =>
  fetchJson<Counties>(`${api}/counties${isNil(districtId) ? "" : `?districtId=${districtId}`}`)
export const fetchIrnTables = (params: GetTableParams) =>
  fetchJson<IrnRepositoryTables>(`${api}/irnTables${buildParams(params)}`)
