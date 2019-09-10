import { isNil } from "ramda"
import { GlobalState } from "./models"

export const getDistricts = (state: GlobalState) => state.staticData.districts

export const getCounties = (state: GlobalState) => (districtId?: number) =>
  state.staticData.counties.filter(c => isNil(districtId) || c.districtId === districtId)
