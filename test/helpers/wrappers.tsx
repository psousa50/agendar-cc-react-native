import { configureStore } from "@reduxjs/toolkit"
import React from "react"
import { ComponentType } from "react"
import { Provider } from "react-redux"
import { DeepPartial } from "redux"
import { Environment, EnvironmentContext } from "../../src/environment/main"
import { rootReducer, RootState } from "../../src/state/rootReducer"

const createStore = (initialState?: DeepPartial<RootState>) =>
  configureStore({ reducer: rootReducer, middleware: [], preloadedState: initialState })

export const withEnvAndStore = (env: Environment, initialState?: DeepPartial<RootState>) => <P extends {}>(
  Component: ComponentType<P>,
) => (props: P) => (
  <EnvironmentContext.Provider value={env}>
    <Provider store={createStore(initialState)}>
      <Component {...props} />
    </Provider>
  </EnvironmentContext.Provider>
)
