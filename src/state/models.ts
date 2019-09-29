import {
  Counties,
  County,
  District,
  Districts,
  GpsLocation,
  IrnPlace,
  IrnPlaces,
  IrnRepositoryTables,
  TimeSlot,
} from "../irnTables/models"

export interface StaticDataState {
  counties: Counties
  districts: Districts
  irnPlaces: IrnPlaces
  error: Error | null
  loaded: boolean
  loading: boolean
}

export interface IrnTableFilterState {
  countyId?: number
  districtId?: number
  gpsLocation?: GpsLocation
  startDate?: Date
  endDate?: Date
  startTime?: TimeSlot
  endTime?: TimeSlot
  selectedDate?: Date
  selectedPlaceName?: string
  selectedTimeSlot?: TimeSlot
}

export interface SelectedIrnTableState {
  countyId?: number
  districtId: number
  date: Date
  placeName: string
}

export interface IrnTablesDataState {
  filter: IrnTableFilterState
  irnTables: IrnRepositoryTables
  filterCache?: IrnTableFilterState
  irnTablesCache?: IrnRepositoryTables
  error: Error | null
  loading: boolean
  selectedIrnTable?: SelectedIrnTableState
}

export interface GlobalState {
  staticData: StaticDataState
  irnTablesData: IrnTablesDataState
}

export const initialGlobalState: GlobalState = {
  staticData: {
    districts: [],
    counties: [],
    irnPlaces: [],
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

export interface ReferenceData {
  getIrnPlace: (place: string) => IrnPlace | undefined
  getIrnPlaces: (countyId: number) => IrnPlaces
  getDistricts: () => Districts
  getDistrict: (districtId?: number) => District | undefined
  getCounties: (districtId?: number) => Counties
  getCounty: (countyId?: number) => County | undefined
}
