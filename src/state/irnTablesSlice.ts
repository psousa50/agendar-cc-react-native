import { pipe } from "fp-ts/lib/pipeable"
import { task } from "fp-ts/lib/Task"
import { fold } from "fp-ts/lib/TaskEither"
import { Dispatch } from "redux"
import { createSlice, PayloadAction } from "redux-starter-kit"
import { fetchIrnTableMatch } from "../api/irnTables"
import { normalizeFilter } from "../irnTables/main"
import { IrnTableResult, TimeSlot } from "../irnTables/models"
import { currentUtcDateString, DateString } from "../utils/dates"
import { IrnTableFilter, IrnTableRefineFilter } from "./models"
import { AppThunk } from "./store"

export interface IrnTableMatchResult {
  irnTableResult?: IrnTableResult
  otherDates: DateString[]
  otherPlaces: string[]
  otherTimeSlots: TimeSlot[]
}

interface IrnTablesDataState {
  error: string | undefined
  filter: IrnTableFilter
  irnTableMatchResult: IrnTableMatchResult
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
    // endDate: toDateString("2019-11-23"),
    // startTime: "19:15",
    // endTime: "19:15",
    // onlyOnSaturdays: true,
  },
  refineFilter: {},
  irnTableMatchResult: {
    irnTableResult: undefined,
    otherDates: [],
    otherPlaces: [],
    otherTimeSlots: [],
  },
  error: undefined,
  loading: false,
}

const irnTablesSlice = createSlice({
  slice: "irnTables",
  initialState,
  reducers: {
    initIrnTableMatchResultFetch(state) {
      state.error = undefined
      state.loading = true
    },
    irnTableMatchResultFetchSuccessful(state, action: PayloadAction<IrnTablesFetchSuccessfulPayload>) {
      const { irnTableMatchResult } = action.payload

      state.irnTableMatchResult = irnTableMatchResult
      state.error = undefined
      state.loading = false
    },
    irnTableMatchResultFetchError(state, action: PayloadAction<string>) {
      state.error = action.payload
      state.loading = false
    },
    updateFilter(state, action: PayloadAction<IrnTableFilter>) {
      state.filter = normalizeFilter({ ...state.filter, ...action.payload })
    },
    setRefineFilter(state, action: PayloadAction<IrnTableRefineFilter>) {
      state.refineFilter = action.payload
    },
  },
})

export const getIrnTableMatch = (irnTablesDataState: IrnTablesDataState): AppThunk => async (dispatch: Dispatch) => {
  const { filter, refineFilter } = irnTablesDataState

  dispatch(initIrnTableMatchResultFetch())
  await pipe(
    fetchIrnTableMatch({ ...filter, ...refineFilter, startDate: filter.startDate || currentUtcDateString() }),
    fold(
      error => {
        dispatch(irnTableMatchResultFetchError(error.message))
        return task.of(undefined)
      },
      irnTableMatchResult => {
        dispatch(irnTableMatchResultFetchSuccessful({ irnTableMatchResult }))
        return task.of(undefined)
      },
    ),
  )()
}

export const {
  updateFilter,
  setRefineFilter,
  initIrnTableMatchResultFetch,
  irnTableMatchResultFetchSuccessful,
  irnTableMatchResultFetchError,
} = irnTablesSlice.actions
export const reducer = irnTablesSlice.reducer
