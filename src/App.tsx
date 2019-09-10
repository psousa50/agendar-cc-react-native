import { StyleProvider } from "native-base"
import React from "react"
import { GlobalStateInitializer } from "./GlobalStateInitializer"
import { RootNavigator } from "./RootNavigator"
import { GlobalStateProvider } from "./state/main"
import { getTheme } from "./theme/components"
import { appTheme } from "./utils/appTheme"

export const App = () => (
  <StyleProvider style={getTheme(appTheme)}>
    <GlobalStateProvider>
      <GlobalStateInitializer />
      <RootNavigator />
    </GlobalStateProvider>
  </StyleProvider>
)
