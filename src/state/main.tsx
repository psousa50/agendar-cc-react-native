import React, { createContext, useContext, useReducer } from "react"
import { Counties, Districts, IrnRepositoryTables } from "../irnTables/models"
import { GlobalState as GlobalStateContext, initialGlobalState, StaticDataState } from "./models"

const GlobalStateContext = createContext<[GlobalStateContext, React.Dispatch<StateAction>]>([
  initialGlobalState,
  () => undefined,
])

type StateAction =
  | {
      type: "FETCH_STATIC_DATA_INIT"
      payload: {}
    }
  | {
      type: "FETCH_STATIC_DATA_SUCCESS"
      payload: { districts: Districts; counties: Counties; irnTables: IrnRepositoryTables }
    }
  | {
      type: "FETCH_STATIC_DATA_FAILURE"
      payload: { error: Error }
    }
  | {
      type: "SET_DISTRICT_ID"
      payload: { districtId: number | undefined }
    }
  | {
      type: "SET_COUNTY_ID"
      payload: { countyId: number | undefined }
    }

type StaticDataReducer = (state: StaticDataState, action: StateAction) => StaticDataState
const staticDataReducer: StaticDataReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_STATIC_DATA_INIT": {
      return {
        ...state,
        error: null,
      }
    }
    case "FETCH_STATIC_DATA_SUCCESS": {
      return {
        ...state,
        ...action.payload,
        error: null,
      }
    }
    case "FETCH_STATIC_DATA_FAILURE": {
      return {
        ...state,
        error: action.payload.error,
      }
    }
    default: {
      return state
    }
  }
}

type GlobalStateReducer = (state: GlobalStateContext, action: StateAction) => GlobalStateContext
const globalStateReducer: GlobalStateReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_STATIC_DATA_INIT":
    case "FETCH_STATIC_DATA_SUCCESS":
    case "FETCH_STATIC_DATA_FAILURE": {
      return {
        ...state,
        staticData: staticDataReducer(state.staticData, action),
      }
    }
    case "SET_DISTRICT_ID": {
      return { ...state, districtId: action.payload.districtId }
    }
    case "SET_COUNTY_ID": {
      return { ...state, countyId: action.payload.countyId }
    }
  }
}

export const GlobalStateProvider: React.FunctionComponent = ({ children }) => {
  return (
    <GlobalStateContext.Provider value={useReducer(globalStateReducer, initialGlobalState)}>
      {children}
    </GlobalStateContext.Provider>
  )
}

export const useGlobalState = () => useContext(GlobalStateContext)
