import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { isNil } from "ramda"
import { Counties, County, District, Districts, IrnService, IrnServices } from "../irnTables/models"
import { Region } from "./models"

interface ReferenceDataState {
  irnServices: IrnServices
  counties: Counties
  districts: Districts
  error: string | undefined
  loaded: boolean
  loading: boolean
}

const initialState: ReferenceDataState = {
  irnServices: [],
  districts: [],
  counties: [],
  error: undefined,
  loaded: false,
  loading: false,
}

interface SuccessfulFetchPayload {
  districts: Districts
  counties: Counties
  irnServices: IrnServices
}

export interface ReferenceDataProxy {
  getIrnService: (serviceId: number) => IrnService | undefined
  getIrnServices: () => IrnServices
  getDistricts: (region?: Region) => Districts
  getDistrict: (districtId?: number) => District | undefined
  getCounties: (districtId?: number) => Counties
  getCounty: (countyId?: number) => County | undefined
}

const referenceDataSlice = createSlice({
  name: "ReferenceData",
  initialState,
  reducers: {
    initFetch(state) {
      state.error = undefined
      state.loading = true
    },
    fetchWasSuccessful(state, action: PayloadAction<SuccessfulFetchPayload>) {
      const { irnServices, districts, counties } = action.payload
      state.irnServices = irnServices
      state.districts = districts
      state.counties = counties
      state.error = undefined
      state.loading = false
      state.loaded = true
    },
    fetchHasAnError(state, action: PayloadAction<string>) {
      state.error = action.payload
      state.loading = false
    },
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload
    },
  },
})

const getIrnServices = (state: ReferenceDataState) => () => state.irnServices
const getIrnService = (state: ReferenceDataState) => (serviceId?: number) =>
  state.irnServices.find(irnService => irnService.serviceId === serviceId)

const getDistricts = (state: ReferenceDataState) => (region?: Region) =>
  state.districts.filter(d => isNil(region) || d.region === region)
const getDistrict = (state: ReferenceDataState) => (districtId?: number) =>
  state.districts.find(d => !isNil(districtId) && d.districtId === districtId)

const getCounties = (state: ReferenceDataState) => (districtId?: number) =>
  state.counties.filter(c => isNil(districtId) || c.districtId === districtId)
const getCounty = (state: ReferenceDataState) => (countyId?: number) =>
  state.counties.find(c => !isNil(countyId) && c.countyId === countyId)

export const buildReferenceDataProxy = (state: ReferenceDataState) => ({
  getIrnService: getIrnService(state),
  getIrnServices: getIrnServices(state),
  getDistricts: getDistricts(state),
  getDistrict: getDistrict(state),
  getCounties: getCounties(state),
  getCounty: getCounty(state),
})

export const { initFetch, fetchWasSuccessful, fetchHasAnError, setError } = referenceDataSlice.actions
export const reducer = referenceDataSlice.reducer
