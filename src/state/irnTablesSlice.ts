import { pipe } from "fp-ts/lib/pipeable"
import { task } from "fp-ts/lib/Task"
import { fold } from "fp-ts/lib/TaskEither"
import { Dispatch } from "redux"
import { createSlice, PayloadAction } from "redux-starter-kit"
import { fetchIrnTableMatch } from "../api/irnTables"
import { normalizeFilter } from "../irnTables/main"
import { TimeSlot } from "../irnTables/models"
import { currentUtcDateString, DateString } from "../utils/dates"
import { IrnTableFilter, IrnTableRefineFilter } from "./models"
import { AppThunk } from "./store"

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

interface IrnTablesDataState {
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
    serviceId: 1,
    // districtId: 12,
    // countyId: 44,
    // placeName: "Conservatória do Registo Civil, Predial e Comercial de Sobral de Monte Agraço",
    // startDate: toDateString("2019-12-16"),
    // endDate: toDateString("2019-12-23"),
    // startTime: "19:15",
    // endTime: "19:15",
    // onlyOnSaturdays: true,
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
  slice: "irnTables",
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

export const getIrnTableMatch = (irnTablesDataState: IrnTablesDataState): AppThunk => async (dispatch: Dispatch) => {
  const { filter, refineFilter } = irnTablesDataState

  dispatch(initIrnTableMatchResultFetch())
  await pipe(
    fetchIrnTableMatch({
      ...filter,
      selected: refineFilter,
      startDate: filter.startDate || currentUtcDateString(),
    }),
    fold(
      error => {
        dispatch(irnTableMatchResultFetchHasAnError(error.message))
        return task.of(undefined)
      },
      irnTableMatchResult => {
        dispatch(irnTableMatchResultFetchWasSuccessful({ irnTableMatchResult }))
        return task.of(undefined)
      },
    ),
  )()
}

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
