import React, { createContext, useReducer } from "react"
import { useContext } from "react"
import { GlobalStateAction, globalStateReducer } from "./state/main"
import { GlobalState, initialGlobalState } from "./state/models"

export const GlobalStateContext = createContext<[GlobalState, React.Dispatch<GlobalStateAction>]>([
  initialGlobalState,
  () => undefined,
])

export const GlobalStateProvider: React.FunctionComponent = ({ children }) => {
  return (
    <GlobalStateContext.Provider value={useReducer(globalStateReducer, initialGlobalState)}>
      {children}
    </GlobalStateContext.Provider>
  )
}

export const useGlobalState = () => useContext(GlobalStateContext)
