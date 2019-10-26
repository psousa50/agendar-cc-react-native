import { AppRegistry } from "react-native"
import { YellowBox } from "react-native"
import { App } from "./App"
import { localeConfig } from "./utils/calendar"

YellowBox.ignoreWarnings(["Warning: componentWillReceiveProps is deprecated"])

localeConfig.defaultLocale = "pt"

AppRegistry.registerComponent("agendarCC", App)
