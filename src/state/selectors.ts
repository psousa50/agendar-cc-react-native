import { isNil } from "ramda"
import { getCountyName } from "../utils/formaters"
import { GlobalState, Region } from "./models"

const getIrnServices = (state: GlobalState) => () => state.staticData.irnServices
const getIrnService = (state: GlobalState) => (serviceId?: number) =>
  state.staticData.irnServices.find(irnService => irnService.serviceId === serviceId)

const getDistricts = (state: GlobalState) => (region?: Region) =>
  state.staticData.districts.filter(d => isNil(region) || d.region === region)
const getDistrict = (state: GlobalState) => (districtId?: number) =>
  state.staticData.districts.find(d => !isNil(districtId) && d.districtId === districtId)

const getCounties = (state: GlobalState) => (districtId?: number) =>
  state.staticData.counties.filter(c => isNil(districtId) || c.districtId === districtId)
const getCounty = (state: GlobalState) => (countyId?: number) =>
  state.staticData.counties.find(c => !isNil(countyId) && c.countyId === countyId)

const getIrnFilterCountyName = (state: GlobalState) => () => {
  const filter = getIrnTablesFilter(state)
  const county = getCounty(state)(filter.countyId)
  const district = getDistrict(state)(filter.districtId)
  return getCountyName(county, district)
}

const getIrnTablesFilter = (state: GlobalState) => state.irnTablesData.filter
const getIrnTablesFilterForEdit = (state: GlobalState) => state.irnTablesData.filterForEdit
const getIrnTablesRefineFilter = (state: GlobalState) => state.irnTablesData.refineFilter
const getIrnTablesFilterCache = (state: GlobalState) => state.irnTablesData.filterCache

const getIrnTables = (state: GlobalState) => state.irnTablesData.irnTables
const getIrnTablesCache = (state: GlobalState) => state.irnTablesData.irnTablesCache

const getSelectedIrnTable = (state: GlobalState) => state.irnTablesData.selectedIrnTable

const getIrnPlace = (state: GlobalState) => (place: string) => state.staticData.irnPlaces.find(p => p.name === place)

const getIrnPlaces = (state: GlobalState) => (countyId?: number) =>
  state.staticData.irnPlaces.filter(p => isNil(countyId) || p.countyId === countyId)

export const globalStateSelectors = (state: GlobalState) => ({
  getStaticData: state.staticData,
  getIrnTablesData: state.irnTablesData,
  getIrnService: getIrnService(state),
  getIrnServices: getIrnServices(state),
  getIrnPlace: getIrnPlace(state),
  getIrnPlaces: getIrnPlaces(state),
  getDistricts: getDistricts(state),
  getDistrict: getDistrict(state),
  getCounties: getCounties(state),
  getCounty: getCounty(state),
  getIrnFilterCountyName: getIrnFilterCountyName(state),
  getIrnTablesFilter: getIrnTablesFilter(state),
  getIrnTablesFilterForEdit: getIrnTablesFilterForEdit(state),
  getIrnTablesRefineFilter: getIrnTablesRefineFilter(state),
  getIrnTablesFilterCache: getIrnTablesFilterCache(state),
  getIrnTables: getIrnTables(state),
  getIrnTablesCache: getIrnTablesCache(state),
  getSelectedIrnTable: getSelectedIrnTable(state),
})

export type GlobalStateSelectors = ReturnType<typeof globalStateSelectors>
