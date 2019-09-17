import { Counties, Districts } from "../irnTables/models"

export interface StaticDataState {
  counties: Counties
  districts: Districts
  error: Error | null
  loaded: boolean
  loading: boolean
}

export interface FilterState {
  countyId: number | undefined
  districtId: number | undefined
}

export interface GlobalState {
  staticData: StaticDataState
  filter: FilterState
}

export const initialGlobalState = {
  staticData: {
    districts: [],
    counties: [],
    error: null,
    loaded: false,
    loading: false,
  },
  filter: {
    countyId: undefined,
    districtId: undefined,
  },
}
