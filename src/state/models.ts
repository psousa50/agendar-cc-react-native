import { Counties, Districts } from "../irnTables/models"

export interface StaticDataState {
  counties: Counties
  districts: Districts
  error: Error | null
  loaded: boolean
  loading: boolean
}

export interface IrnFilterState {
  countyId: number | undefined
  districtId: number | undefined
}

export interface GlobalState {
  staticData: StaticDataState
  irnFilter: IrnFilterState
}

export const initialGlobalState: GlobalState = {
  staticData: {
    districts: [],
    counties: [],
    error: null,
    loaded: false,
    loading: false,
  },
  irnFilter: {
    countyId: undefined,
    districtId: undefined,
  },
}
