import React from "react"
import { ComponentType } from "react"
import { Provider } from "react-redux"
import { DeepPartial } from "redux"
import { configureStore } from "redux-starter-kit"
import { Environment, EnvironmentContext } from "../../src/environment/main"
import { rootReducer, RootState } from "../../src/state/rootReducer"

export const withEnvAndStore = (env: Environment, initialState?: DeepPartial<RootState>) => <P extends {}>(
  Component: ComponentType<P>,
) => (props: P) => {
  const store = configureStore({ reducer: rootReducer, middleware: [], preloadedState: initialState })

  return (
    <EnvironmentContext.Provider value={env}>
      <Provider store={store}>
        <Component {...props} />
      </Provider>
    </EnvironmentContext.Provider>
  )
}
