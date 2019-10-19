import { AppRegistry, Dimensions } from "react-native"
import { YellowBox } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import { configureStore } from "redux-starter-kit"
import { App } from "./App"
import { rootReducer } from "./state/rootReducer"
import { localeConfig } from "./utils/calendar"

const { scale } = Dimensions.get("window")
EStyleSheet.build({
  $rem: scale > 1.5 ? 15 : 10,
})

YellowBox.ignoreWarnings(["Warning: componentWillReceiveProps is deprecated"])

localeConfig.defaultLocale = "pt"

const store = configureStore({ reducer: rootReducer })

AppRegistry.registerComponent("agendarCC", () => App({ store }))