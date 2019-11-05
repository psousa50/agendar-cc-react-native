import { AppRegistry } from "react-native"
import { YellowBox } from "react-native"
import { App } from "./App"

YellowBox.ignoreWarnings(["Warning: componentWillReceiveProps is deprecated"])

// localeConfig.defaultLocale = "pt"

AppRegistry.registerComponent("agendarCC", App)
