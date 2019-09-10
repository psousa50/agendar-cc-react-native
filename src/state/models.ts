import { Counties, Districts } from "../irnTables/models"

export interface StaticDataState {
  districts: Districts
  counties: Counties
  error: Error | null
}
export interface GlobalState {
  staticData: StaticDataState
  countyId: number | undefined
  districtId: number | undefined
}

export const initialGlobalState = {
  staticData: {
    districts: [],
    counties: [],
    error: null,
  },
  countyId: undefined,
  districtId: undefined,
}
