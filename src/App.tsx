import { StyleProvider } from "native-base"
import React from "react"
import { RootNavigator } from "./RootNavigator"
import { GlobalStateProvider } from "./state/main"
import { getTheme } from "./theme/components"
import { appTheme } from "./utils/appTheme"

export const App = () => {
  return (
    <StyleProvider style={getTheme(appTheme)}>
      <GlobalStateProvider>
        <RootNavigator />
      </GlobalStateProvider>
    </StyleProvider>
  )
}
