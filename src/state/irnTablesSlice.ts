import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { normalizeFilter } from "../irnTables/main"
import { TimeSlot } from "../irnTables/models"
import { DateString } from "../utils/dates"
import { IrnServiceId, IrnTableFilter, IrnTableRefineFilter } from "./models"

export interface IrnTableResult {
  serviceId: number
  countyId: number
  districtId: number
  date: DateString
  placeName: string
  timeSlot: TimeSlot
  tableNumber: string
}
export interface IrnTableMatchResults {
  closest: IrnTableResult
  soonest: IrnTableResult
}

export interface IrnTableMatchResult {
  irnTableResults?: IrnTableMatchResults
  otherDates: DateString[]
  otherPlaces: string[]
  otherTimeSlots: TimeSlot[]
}

export interface IrnTablesDataState {
  error: string | undefined
  filter: IrnTableFilter
  irnTableMatchResult: IrnTableMatchResult
  selectedIrnTableResult?: IrnTableResult
  loading: boolean
  refineFilter: IrnTableRefineFilter
}

interface IrnTablesFetchSuccessfulPayload {
  irnTableMatchResult: IrnTableMatchResult
}

export const initialState: IrnTablesDataState = {
  filter: {
    region: "Continente",
    serviceId: IrnServiceId.getCC,
  },
  refineFilter: {},
  irnTableMatchResult: {
    irnTableResults: undefined,
    otherDates: [],
    otherPlaces: [],
    otherTimeSlots: [],
  },
  selectedIrnTableResult: undefined,
  error: undefined,
  loading: false,
}

const irnTablesSlice = createSlice({
  name: "irnTables",
  initialState,
  reducers: {
    initIrnTableMatchResultFetch(state) {
      state.irnTableMatchResult = initialState.irnTableMatchResult
      state.error = undefined
      state.loading = true
    },
    irnTableMatchResultFetchWasSuccessful(state, action: PayloadAction<IrnTablesFetchSuccessfulPayload>) {
      const { irnTableMatchResult } = action.payload

      state.irnTableMatchResult = irnTableMatchResult
      state.error = undefined
      state.loading = false
    },
    irnTableMatchResultFetchHasAnError(state, action: PayloadAction<string>) {
      state.error = action.payload
      state.loading = false
    },
    updateFilter(state, action: PayloadAction<IrnTableFilter>) {
      state.filter = normalizeFilter({ ...state.filter, ...action.payload })
    },
    updateRefineFilter(state, action: PayloadAction<IrnTableRefineFilter>) {
      state.refineFilter = { ...state.refineFilter, ...action.payload }
    },
    clearRefineFilter(state) {
      state.refineFilter = {}
    },
    setSelectedIrnTableResult(state, action: PayloadAction<IrnTableResult | undefined>) {
      state.selectedIrnTableResult = action.payload
    },
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload
    },
  },
})

export const {
  clearRefineFilter,
  initIrnTableMatchResultFetch,
  irnTableMatchResultFetchHasAnError,
  irnTableMatchResultFetchWasSuccessful,
  setError,
  setSelectedIrnTableResult,
  updateFilter,
  updateRefineFilter,
} = irnTablesSlice.actions
export const reducer = irnTablesSlice.reducer
