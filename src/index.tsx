import { AppRegistry } from "react-native"
import { YellowBox } from "react-native"
import { App } from "./App"

YellowBox.ignoreWarnings(["Warning: componentWillReceiveProps is deprecated"])

AppRegistry.registerComponent("agendarCC", App)
