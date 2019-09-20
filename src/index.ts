import { AppRegistry } from "react-native"
import { App } from "./App"
import { localeConfig } from "./utils/calendar"

localeConfig.defaultLocale = "pt"

AppRegistry.registerComponent("agendarCC", () => App)
