import { StyleProvider } from "native-base"
import React from "react"
import { Provider } from "react-redux"
import { RootNavigator } from "./RootNavigator"
import { store } from "./state/store"
import { getTheme } from "./theme/components"
import { appTheme } from "./utils/appTheme"

export const App = () => (
  <StyleProvider style={getTheme(appTheme)}>
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  </StyleProvider>
)
