import { Counties, Districts } from "../irnTables/models"
import { FilterState, GlobalState, StaticDataState } from "./models"

export type GlobalStateAction =
  | {
      type: "FETCH_STATIC_DATA_INIT"
      payload: {}
    }
  | {
      type: "FETCH_STATIC_DATA_SUCCESS"
      payload: { districts: Districts; counties: Counties }
    }
  | {
      type: "FETCH_STATIC_DATA_FAILURE"
      payload: { error: Error }
    }
  | {
      type: "SET_FILTER"
      payload: { filter: FilterState }
    }
  | {
      type: "SET_DISTRICT_ID"
      payload: { districtId: number | undefined }
    }
  | {
      type: "SET_COUNTY_ID"
      payload: { countyId: number | undefined }
    }

type StaticDataReducer = (state: StaticDataState, action: GlobalStateAction) => StaticDataState
const staticDataReducer: StaticDataReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_STATIC_DATA_INIT": {
      return {
        ...state,
        error: null,
        loading: true,
      }
    }
    case "FETCH_STATIC_DATA_SUCCESS": {
      return {
        ...state,
        ...action.payload,
        error: null,
        loaded: true,
        loading: false,
      }
    }
    case "FETCH_STATIC_DATA_FAILURE": {
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      }
    }
    default: {
      return state
    }
  }
}

type GlobalStateReducer = (state: GlobalState, action: GlobalStateAction) => GlobalState
export const globalStateReducer: GlobalStateReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_STATIC_DATA_INIT":
    case "FETCH_STATIC_DATA_SUCCESS":
    case "FETCH_STATIC_DATA_FAILURE": {
      return {
        ...state,
        staticData: staticDataReducer(state.staticData, action),
      }
    }
    case "SET_FILTER": {
      return { ...state, filter: { ...state.filter, ...action.payload.filter } }
    }
    case "SET_DISTRICT_ID": {
      return { ...state, districtId: action.payload.districtId }
    }
    case "SET_COUNTY_ID": {
      return { ...state, countyId: action.payload.countyId }
    }
  }
}
