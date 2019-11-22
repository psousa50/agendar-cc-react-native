import { StyleProvider } from "native-base"
import React from "react"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { LoadingPage } from "./components/common/LoadingPage"
import { environment, EnvironmentContext } from "./environment/main"
import { RootNavigator } from "./RootNavigator"
import { store, storePersistor } from "./state/store"
import { getTheme } from "./theme/components"
import { appTheme } from "./utils/appTheme"

export const App = () => () => (
  <StyleProvider style={getTheme(appTheme)}>
    <EnvironmentContext.Provider value={environment}>
      <Provider store={store}>
        <PersistGate loading={<LoadingPage />} persistor={storePersistor}>
          <RootNavigator />
        </PersistGate>
      </Provider>
    </EnvironmentContext.Provider>
  </StyleProvider>
)
