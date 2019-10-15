import { StyleProvider } from "native-base"
import React from "react"
import { Provider } from "react-redux"
import { Store } from "redux"
import { RootNavigator } from "./RootNavigator"
import { getTheme } from "./theme/components"
import { appTheme } from "./utils/appTheme"

interface AppProps {
  store: Store
}

export const AppContainer: React.FC<AppProps> = ({ store, children }) => (
  <StyleProvider style={getTheme(appTheme)}>
    <Provider store={store}>{children}</Provider>
  </StyleProvider>
)

export const App = (props: AppProps) => () => (
  <AppContainer {...props}>
    <RootNavigator />
  </AppContainer>
)
