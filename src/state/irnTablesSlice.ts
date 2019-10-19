import { pipe } from "fp-ts/lib/pipeable"
import { task } from "fp-ts/lib/Task"
import { fold } from "fp-ts/lib/TaskEither"
import { Dispatch } from "redux"
import { createSlice, PayloadAction } from "redux-starter-kit"
import { fetchIrnTables } from "../api/irnTables"
import { byIrnTableFilter, normalizeFilter } from "../irnTables/main"
import { IrnRepositoryTables, IrnTableResult } from "../irnTables/models"
import { filtersAreCompatible } from "../utils/filters"
import { IrnTableFilter, IrnTableRefineFilter } from "./models"
import { AppThunk } from "./store"

interface IrnTablesDataState {
  filter: IrnTableFilter
  refineFilter: IrnTableRefineFilter
  irnTables: IrnRepositoryTables
  filterCache?: IrnTableFilter
  irnTablesCache?: IrnRepositoryTables
  irnTablesCacheTimestamp?: number
  error: string | undefined
  loading: boolean
  irnTableResult?: IrnTableResult
}

interface IrnTablesFetchSuccessfulPayload {
  irnTables: IrnRepositoryTables
  timestamp: number
}
interface UpdateIrnTablesPayload {
  filter: IrnTableFilter
  irnTables: IrnRepositoryTables
}

export const initialState: IrnTablesDataState = {
  filter: {
    region: "Continente",
    serviceId: 1,
    // districtId: 12,
    // countyId: 44,
    // placeName: "Conservatória do Registo Civil, Predial e Comercial de Sobral de Monte Agraço",
    // startDate: toDateOnly("2019-11-03"),
    // endDate: toDateOnly("2019-11-23"),
    // startTime: "12:45",
    // endTime: "15:50",
    // onlyOnSaturdays: true,
  },
  refineFilter: {},
  irnTables: [],
  error: undefined,
  loading: false,
}

const irnTablesSlice = createSlice({
  slice: "irnTables",
  initialState,
  reducers: {
    initIrnTablesFetch(state) {
      state.error = undefined
      state.loading = true
    },
    irnTablesFetchWasSuccessful(state, action: PayloadAction<IrnTablesFetchSuccessfulPayload>) {
      const { irnTables, timestamp } = action.payload

      state.irnTables = irnTables
      state.irnTablesCache = irnTables
      state.irnTablesCacheTimestamp = timestamp
      state.filterCache = state.filter
      state.error = undefined
      state.loading = false
    },
    irnTablesFetchError(state, action: PayloadAction<string>) {
      state.error = action.payload
      state.loading = false
    },
    updateIrnTables(state, action: PayloadAction<UpdateIrnTablesPayload>) {
      const { filter, irnTables } = action.payload
      state.filter = filter
      state.irnTables = irnTables
      state.loading = false
    },
    updateFilter(state, action: PayloadAction<IrnTableFilter>) {
      state.filter = normalizeFilter({ ...state.filter, ...action.payload })
    },
    setRefineFilter(state, action: PayloadAction<IrnTableRefineFilter>) {
      state.refineFilter = action.payload
    },
    setIrnTableResult(state, action: PayloadAction<IrnTableResult>) {
      state.irnTableResult = action.payload
    },
  },
})

export const getIrnTables = (irnTablesDataState: IrnTablesDataState): AppThunk => async (dispatch: Dispatch) => {
  const filter = irnTablesDataState.filter
  const filterCache = irnTablesDataState.filterCache
  const irnTablesCache = irnTablesDataState.irnTablesCache

  const cacheIsValid =
    irnTablesDataState.irnTablesCacheTimestamp &&
    Date.now() - irnTablesDataState.irnTablesCacheTimestamp < 5 * 60 * 1000
  const inCache = cacheIsValid && irnTablesCache && filterCache && filtersAreCompatible(filterCache, filter)

  if (inCache && irnTablesCache) {
    dispatch(updateIrnTables({ irnTables: irnTablesCache.filter(byIrnTableFilter(filter)), filter }))
  } else {
    dispatch(initIrnTablesFetch())
    await pipe(
      fetchIrnTables(filter),
      fold(
        error => {
          dispatch(irnTablesFetchError(error.message))
          return task.of(undefined)
        },
        irnTables => {
          dispatch(irnTablesFetchWasSuccessful({ irnTables, timestamp: Date.now() }))
          return task.of(undefined)
        },
      ),
    )()
  }
}

export const {
  updateFilter,
  setRefineFilter,
  initIrnTablesFetch,
  irnTablesFetchWasSuccessful,
  irnTablesFetchError,
  updateIrnTables,
  setIrnTableResult,
} = irnTablesSlice.actions
export const reducer = irnTablesSlice.reducer
