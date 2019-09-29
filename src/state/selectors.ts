import { isNil } from "ramda"
import { getCountyName } from "../utils/formaters"
import { GlobalState } from "./models"

export const getDistricts = (state: GlobalState) => () => state.staticData.districts
export const getDistrict = (state: GlobalState) => (districtId?: number) =>
  state.staticData.districts.find(d => !isNil(districtId) && d.districtId === districtId)

export const getCounties = (state: GlobalState) => (districtId?: number) =>
  state.staticData.counties.filter(c => isNil(districtId) || c.districtId === districtId)
export const getCounty = (state: GlobalState) => (countyId?: number) =>
  state.staticData.counties.find(c => !isNil(countyId) && c.countyId === countyId)

export const getIrnFilterCountyName = (state: GlobalState) => {
  const filter = getIrnTablesFilter(state)
  const county = getCounty(state)(filter.countyId)
  const district = getDistrict(state)(filter.districtId)
  return getCountyName(county, district)
}

export const getIrnTablesFilter = (state: GlobalState) => state.irnTablesData.filter
export const getIrnTablesFilterCache = (state: GlobalState) => state.irnTablesData.filterCache

export const getIrnTables = (state: GlobalState) => state.irnTablesData.irnTables
export const getIrnTablesCache = (state: GlobalState) => state.irnTablesData.irnTablesCache

export const getSelectedIrnTable = (state: GlobalState) => state.irnTablesData.selectedIrnTable

export const getIrnPlace = (state: GlobalState) => (place: string) =>
  state.staticData.irnPlaces.find(p => p.name === place)

export const getIrnPlaces = (state: GlobalState) => (countyId: number) =>
  state.staticData.irnPlaces.filter(p => p.countyId === countyId)

export const globalStateSelectors = (state: GlobalState) => ({
  getIrnTablesData: state.irnTablesData,
  getIrnPlace: getIrnPlace(state),
  getIrnPlaces: getIrnPlaces(state),
  getDistricts: getDistricts(state),
  getDistrict: getDistrict(state),
  getCounties: getCounties(state),
  getCounty: getCounty(state),
  getIrnFilterCountyName: getIrnFilterCountyName(state),
  getIrnTablesFilter: getIrnTablesFilter(state),
  getIrnTablesFilterCache: getIrnTablesFilterCache(state),
  getIrnTables: getIrnTables(state),
  getIrnTablesCache: getIrnTablesCache(state),
  getSelectedIrnTable: getSelectedIrnTable(state),
})
