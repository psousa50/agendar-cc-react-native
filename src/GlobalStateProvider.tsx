import React, { createContext, useReducer } from "react"
import { useContext } from "react"
import { GlobalStateAction } from "./state/actions"
import { globalStateReducer } from "./state/main"
import { GlobalState, initialGlobalState } from "./state/models"

export const GlobalStateContext = createContext<[GlobalState, React.Dispatch<GlobalStateAction>]>([
  initialGlobalState,
  () => undefined,
])

export const GlobalStateProvider: React.FunctionComponent = ({ children }) => {
  const globalState = useReducer(globalStateReducer, initialGlobalState)
  return <GlobalStateContext.Provider value={globalState}>{children}</GlobalStateContext.Provider>
}

export const useGlobalState = () => useContext(GlobalStateContext)
