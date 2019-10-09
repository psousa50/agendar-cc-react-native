import {
  Counties,
  County,
  District,
  DistrictAndCounty,
  Districts,
  GpsLocation,
  IrnPlace,
  IrnPlaces,
  IrnRepositoryTables,
  IrnService,
  IrnServices,
  TimeSlot,
} from "../irnTables/models"

export interface StaticDataState {
  irnServices: IrnServices
  counties: Counties
  districts: Districts
  irnPlaces: IrnPlaces
  error: Error | null
  loaded: boolean
  loading: boolean
}

export interface DatePeriod {
  endDate?: Date
  startDate?: Date
}

export interface TimePeriod {
  endTime?: TimeSlot
  startTime?: TimeSlot
}

export type Region = "Acores" | "Continente" | "Madeira"

export interface IrnTableFilterLocationState {
  countyId?: number
  distanceRadiusKm?: number
  districtId?: number
  gpsLocation?: GpsLocation
  placeName?: string
  region?: Region
}

export interface IrnTableFilterDateTimeState {
  endDate?: Date
  endTime?: TimeSlot
  onlyOnSaturdays?: boolean
  startDate?: Date
  startTime?: TimeSlot
}

export interface IrnTableRefineFilter {
  countyId?: number
  districtId?: number
  date?: Date
  placeName?: string
  timeSlot?: TimeSlot
}

export interface IrnTableFilter extends IrnTableFilterLocationState, IrnTableFilterDateTimeState {
  serviceId?: number
}

export interface TimeSlotsFilter {
  endTime?: TimeSlot
  startTime?: TimeSlot
  timeSlot?: TimeSlot
}

export const allRegions: Region[] = ["Continente", "Acores", "Madeira"]
type RegionNames = {
  [k: string]: string
}
export const regionNames: RegionNames = {
  ["Continente"]: "Continente",
  ["Acores"]: "Açores",
  ["Madeira"]: "Madeira",
}

export interface SelectedIrnTableState {
  countyId?: number
  districtId: number
  date: Date
  placeName: string
}

export interface IrnTablesDataState {
  filter: IrnTableFilter
  filterForEdit: IrnTableFilter
  refineFilter: IrnTableRefineFilter
  irnTables: IrnRepositoryTables
  filterCache?: IrnTableFilter
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
    irnServices: [],
    districts: [],
    counties: [],
    irnPlaces: [],
    error: null,
    loaded: false,
    loading: false,
  },
  irnTablesData: {
    filter: {},
    filterForEdit: {},
    refineFilter: {},
    irnTables: [],
    error: null,
    loading: false,
  },
}

export interface ReferenceData {
  getIrnService: (serviceId: number) => IrnService | undefined
  getIrnServices: () => IrnServices
  getIrnPlace: (place: string) => IrnPlace | undefined
  getIrnPlaces: ({ districtId, countyId }: DistrictAndCounty) => IrnPlaces
  getDistricts: () => Districts
  getDistrict: (districtId?: number) => District | undefined
  getCounties: (districtId?: number) => Counties
  getCounty: (countyId?: number) => County | undefined
}
