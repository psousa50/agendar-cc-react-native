import { isNil } from "ramda"
import { GlobalState } from "./models"

export const getDistricts = (state: GlobalState) => state.staticData.districts
export const getDistrict = (state: GlobalState) => (districtId?: number) =>
  state.staticData.districts.find(d => !isNil(districtId) && d.districtId === districtId)

export const getCounties = (state: GlobalState) => (districtId?: number) =>
  state.staticData.counties.filter(c => isNil(districtId) || c.districtId === districtId)
export const getCounty = (state: GlobalState) => (countyId?: number) =>
  state.staticData.counties.find(c => !isNil(countyId) && c.countyId === countyId)

export const getIrnTablesFilter = (state: GlobalState) => state.irnTablesData.filter
export const getIrnTablesFilterCache = (state: GlobalState) => state.irnTablesData.filterCache

export const getIrnTables = (state: GlobalState) => state.irnTablesData.irnTables
export const getIrnTablesCache = (state: GlobalState) => state.irnTablesData.irnTablesCache
