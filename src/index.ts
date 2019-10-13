import { AppRegistry, Dimensions } from "react-native"
import { YellowBox } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import { App } from "./App"
import { localeConfig } from "./utils/calendar"

const { scale } = Dimensions.get("window")
EStyleSheet.build({
  $rem: scale > 1.5 ? 16 : 10,
})

YellowBox.ignoreWarnings(["Warning: componentWillReceiveProps is deprecated"])

localeConfig.defaultLocale = "pt"

AppRegistry.registerComponent("agendarCC", () => App)
