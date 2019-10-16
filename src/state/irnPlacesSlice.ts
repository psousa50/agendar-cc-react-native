import { pipe } from "fp-ts/lib/pipeable"
import { task } from "fp-ts/lib/Task"
import { fold } from "fp-ts/lib/TaskEither"
import { isNil } from "ramda"
import { Dispatch } from "redux"
import { createSlice, PayloadAction } from "redux-starter-kit"
import { fetchIrnPlaces } from "../api/irnPlaces"
import { DistrictAndCounty, IrnPlace, IrnPlaces } from "../irnTables/models"
import { AppThunk } from "./store"

interface IrnPlacesDataState {
  irnPlaces: IrnPlaces
  error: string | undefined
  loading: boolean
}

export const initialState: IrnPlacesDataState = {
  irnPlaces: [],
  error: undefined,
  loading: false,
}

export interface IrnPlacesProxy {
  getIrnPlace: (place: string) => IrnPlace | undefined
  getIrnPlaces: (districtAndCounty: DistrictAndCounty) => IrnPlaces
}

const irnPlacesSlice = createSlice({
  slice: "irnPlaces",
  initialState,
  reducers: {
    initIrnPlacesFetch(state) {
      state.error = undefined
      state.loading = true
    },
    irnPlacesFetchWasSuccessful(state, action: PayloadAction<IrnPlaces>) {
      const irnPlaces = action.payload

      state.irnPlaces = irnPlaces
      state.error = undefined
      state.loading = false
    },
    irnPlacesFetchError(state, action: PayloadAction<string>) {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const getIrnPlaces = (): AppThunk => async (dispatch: Dispatch) => {
  dispatch(initIrnPlacesFetch())
  await pipe(
    fetchIrnPlaces(),
    fold(
      error => {
        dispatch(irnPlacesFetchError(error.message))
        return task.of(undefined)
      },
      irnPlaces => {
        dispatch(irnPlacesFetchWasSuccessful(irnPlaces))
        return task.of(undefined)
      },
    ),
  )()
}

const getIrnPlace = (state: IrnPlacesDataState) => (place: string) => state.irnPlaces.find(p => p.name === place)
const getIrnPlaces2 = (state: IrnPlacesDataState) => ({ districtId, countyId }: DistrictAndCounty = {}) =>
  state.irnPlaces.filter(
    p => (isNil(districtId) || p.districtId === districtId) && (isNil(countyId) || p.countyId === countyId),
  )

export const buildIrnPlacesProxy = (state: IrnPlacesDataState) => ({
  getIrnPlace: getIrnPlace(state),
  getIrnPlaces: getIrnPlaces2(state),
})

export const { initIrnPlacesFetch, irnPlacesFetchWasSuccessful, irnPlacesFetchError } = irnPlacesSlice.actions
export const reducer = irnPlacesSlice.reducer
