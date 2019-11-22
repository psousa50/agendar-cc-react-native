import { isNil } from "ramda"
import { createSlice, PayloadAction } from "redux-starter-kit"
import { DistrictAndCounty, IrnPlace, IrnPlaces } from "../irnTables/models"

interface IrnPlacesDataState {
  irnPlaces: IrnPlaces
  error: string | undefined
  loaded: boolean
  loading: boolean
}

export const initialState: IrnPlacesDataState = {
  irnPlaces: [],
  error: undefined,
  loaded: false,
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
      state.loaded = true
      state.loading = false
    },
    irnPlacesFetchHasAnError(state, action: PayloadAction<string>) {
      state.error = action.payload
      state.loading = false
    },
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload
    },
  },
})

const getIrnPlace = (state: IrnPlacesDataState) => (place: string) => state.irnPlaces.find(p => p.name === place)
const getIrnPlaces2 = (state: IrnPlacesDataState) => ({ districtId, countyId }: DistrictAndCounty = {}) =>
  state.irnPlaces.filter(
    p => (isNil(districtId) || p.districtId === districtId) && (isNil(countyId) || p.countyId === countyId),
  )

export const buildIrnPlacesProxy = (state: IrnPlacesDataState) => ({
  getIrnPlace: getIrnPlace(state),
  getIrnPlaces: getIrnPlaces2(state),
})

export const {
  initIrnPlacesFetch,
  irnPlacesFetchWasSuccessful,
  irnPlacesFetchHasAnError,
  setError,
} = irnPlacesSlice.actions
export const reducer = irnPlacesSlice.reducer
