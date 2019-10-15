import { pipe } from "fp-ts/lib/pipeable"
import { task } from "fp-ts/lib/Task"
import { fold } from "fp-ts/lib/TaskEither"
import { Dispatch } from "redux"
import { createSlice, PayloadAction } from "redux-starter-kit"
import { fetchIrnTables } from "../api/irnTables"
import { normalizeFilter } from "../irnTables/main"
import { IrnRepositoryTables } from "../irnTables/models"
import { IrnTableFilter, IrnTableRefineFilter } from "./models"
import { AppThunk } from "./store"

interface SelectedIrnTable {
  countyId?: number
  districtId: number
  date: Date
  placeName: string
}
interface IrnTablesDataState {
  filter: IrnTableFilter
  refineFilter: IrnTableRefineFilter
  irnTables: IrnRepositoryTables
  filterCache?: IrnTableFilter
  irnTablesCache?: IrnRepositoryTables
  error: Error | null
  loading: boolean
  selectedIrnTable?: SelectedIrnTable
}

interface UpdateIrnTablesPayload {
  filter: IrnTableFilter
  irnTables: IrnRepositoryTables
}

export const initialState: IrnTablesDataState = {
  filter: {
    region: "Continente",
    serviceId: 1,
    districtId: 12,
    countyId: 5,
    placeName:
      "Centro Comercial Arrábida Shoping - R. Manuel Moreira de Barros e Praceta Henrique Moreira 244, Afurada, loja A nº 029",
    // startDate: new Date("2019-11-03"),
    // endDate: new Date("2019-11-23"),
    startTime: "12:45",
    endTime: "15:50",
  },
  refineFilter: {},
  irnTables: [],
  error: null,
  loading: false,
}

const irnTablesSlice = createSlice({
  slice: "irnTables",
  initialState,
  reducers: {
    initIrnTablesFetch(state) {
      state.error = null
      state.loading = true
    },
    irnTablesFetchWasSuccessful(state, action: PayloadAction<IrnRepositoryTables>) {
      const irnTables = action.payload

      state.irnTables = irnTables
      state.irnTablesCache = irnTables
      state.filterCache = state.filter
      state.error = null
      state.loading = false
    },
    irnTablesFetchError(state, action: PayloadAction<Error>) {
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
  },
})

export const getIrnTables = (filter: IrnTableFilter): AppThunk => async (dispatch: Dispatch) => {
  dispatch(initIrnTablesFetch())
  await pipe(
    fetchIrnTables(filter),
    fold(
      error => {
        dispatch(irnTablesFetchError(error))
        return task.of(undefined)
      },
      irnTables => {
        dispatch(irnTablesFetchWasSuccessful(irnTables))
        return task.of(undefined)
      },
    ),
  )()
}

export const {
  updateFilter,
  setRefineFilter,
  initIrnTablesFetch,
  irnTablesFetchWasSuccessful,
  irnTablesFetchError,
} = irnTablesSlice.actions
export const reducer = irnTablesSlice.reducer
