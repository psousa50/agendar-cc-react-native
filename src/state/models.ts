import { Counties, Districts, IrnRepositoryTables } from "../irnTables/models"

export interface StaticDataState {
  districts: Districts
  counties: Counties
  irnTables: IrnRepositoryTables
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
    irnTables: [],
    error: null,
  },
  countyId: undefined,
  districtId: undefined,
}
