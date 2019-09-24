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

export interface SelectedIrnTableState {
  countyId?: number
  districtId: number
  date: Date
  placeName: string
}

export interface IrnTablesDataState {
  filter: IrnFilterState
  irnTables: IrnRepositoryTables
  filterCache?: IrnFilterState
  irnTablesCache?: IrnRepositoryTables
  error: Error | null
  loading: boolean
  selectedIrnTable?: SelectedIrnTableState | null
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
    filter: {},
    irnTables: [],
    error: null,
    loading: false,
  },
}
