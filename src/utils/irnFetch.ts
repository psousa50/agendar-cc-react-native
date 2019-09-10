import { isNil, keys } from "ramda"
import { Counties, Districts, GetTableParams, IrnRepositoryTables } from "../irnTables/models"
import { fetchJson } from "./fetch"

const HOST = "192.168.1.105"
const PORT = 3000
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
