import { Counties, Districts, IrnRepositoryTables } from "../irnTables/models"

export interface StaticDataState {
  counties: Counties
  districts: Districts
  error: Error | null
  loaded: boolean
  loading: boolean
}

export interface IrnFilterState {
  countyId?: number
  districtId?: number
  startDate?: Date
  endDate?: Date
  selectedDate?: Date | null
}

export interface IrnTablesDataState {
  filter: IrnFilterState
  irnTables: IrnRepositoryTables
  filterCache?: IrnFilterState
  irnTablesCache?: IrnRepositoryTables
  error: Error | null
  loading: boolean
}

export interface GlobalState {
  staticData: StaticDataState
  irnTablesData: IrnTablesDataState
}

export const initialGlobalState: GlobalState = {
  staticData: {
    districts: [],
    counties: [],
    error: null,
    loaded: false,
    loading: false,
  },
  irnTablesData: {
    filter: { districtId: 12 },
    irnTables: [],
    error: null,
    loading: false,
  },
}
