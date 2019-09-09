import React, { createContext, useContext, useReducer } from "react"
import { GlobalState, initialGlobalState } from "./models"

const GlobalState = createContext<[GlobalState, React.Dispatch<StateAction>]>([initialGlobalState, () => undefined])

type StateAction =
  | {
      type: "SET_DISTRICT_ID"
      payload: { districtId: number | undefined }
    }
  | {
      type: "SET_COUNTY_ID"
      payload: { countyId: number | undefined }
    }

type GlobalStateReducer = (state: GlobalState, action: StateAction) => GlobalState

export const globalStateReducer: GlobalStateReducer = (state, action) => {
  switch (action.type) {
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
    <GlobalState.Provider value={useReducer(globalStateReducer, initialGlobalState)}>{children}</GlobalState.Provider>
  )
}

export const useGlobalState = () => useContext(GlobalState)
