import { isNil } from "ramda"
import { GetTableParams, IrnRepositoryTable } from "../irnTables/models"
import { GlobalState } from "./models"

export const getDistricts = (state: GlobalState) => state.staticData.districts
export const getDistrict = (state: GlobalState) => (districtId: number) =>
  state.staticData.districts.find(d => d.districtId === districtId)

export const getCounties = (state: GlobalState) => (districtId?: number) =>
  state.staticData.counties.filter(c => isNil(districtId) || c.districtId === districtId)
export const getCounty = (state: GlobalState) => (countyId: number) =>
  state.staticData.counties.find(c => c.countyId === countyId)

const by = ({ serviceId, districtId, countyId, startDate, endDate }: GetTableParams) => (
  irnTable: IrnRepositoryTable,
) =>
  (isNil(serviceId) || irnTable.serviceId === serviceId) &&
  (isNil(districtId) || irnTable.county.districtId === districtId) &&
  (isNil(countyId) || irnTable.county.countyId === countyId) &&
  (isNil(startDate) || irnTable.date >= startDate) &&
  (isNil(endDate) || irnTable.date <= endDate)

export const getIrnTables = (state: GlobalState) => (params: GetTableParams) =>
  state.staticData.irnTables.filter(by(params))
