import { AppRegistry } from "react-native"
import { YellowBox } from "react-native"
import { configureStore } from "redux-starter-kit"
import { App } from "./App"
import { rootReducer } from "./state/rootReducer"
import { localeConfig } from "./utils/calendar"

YellowBox.ignoreWarnings(["Warning: componentWillReceiveProps is deprecated"])

localeConfig.defaultLocale = "pt"

const store = configureStore({ reducer: rootReducer })

AppRegistry.registerComponent("agendarCC", () => App({ store }))
