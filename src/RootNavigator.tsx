import { Root } from "native-base"
import React from "react"
import { Animated, Easing, Platform, StatusBar } from "react-native"
import { createStackNavigator } from "react-navigation"
import { createAppContainer } from "react-navigation"
import { NavigationSceneRendererProps } from "react-navigation"
import { HomeScreen } from "./screens/HomeScreen"
import { IrnTablesByDateScreen } from "./screens/IrnTablesByDateScreen"
import { IrnTablesResultsMapScreen } from "./screens/IrnTablesResultsMapScreen"
import { IrnTablesResultsScreen } from "./screens/IrnTablesResultsScreen"
import { SelectDateTimeScreen } from "./screens/SelectDateTimeScreen"
import { SelectedIrnTableScreen } from "./screens/SelectedIrnTableScreen"
import { SelectLocationByMapScreen } from "./screens/SelectLocationByMapScreen"
import { SelectLocationScreen } from "./screens/SelectLocationScreen"
import { SelectPeriodScreen } from "./screens/SelectPeriodScreen"
import { Test } from "./Test"
import { appTheme } from "./utils/appTheme"

const transitionConfig = () => {
  return {
    transitionSpec: {
      duration: 300,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: (sceneProps: NavigationSceneRendererProps) => {
      const { layout, position, scene } = sceneProps

      const thisSceneIndex = scene.index
      const width = layout.initWidth

      const translateX = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex],
        outputRange: [width, 0],
      })

      return { transform: [{ translateX }] }
    },
  }
}

export const ContentNavigator = createStackNavigator(
  {
    HomeScreen,
    IrnTablesByDateScreen,
    IrnTablesResultsScreen,
    IrnTablesResultsMapScreen,
    SelectedIrnTableScreen,
    SelectDateTimeScreen,
    SelectLocationScreen,
    SelectLocationByMapScreen,
    SelectPeriodScreen,
    Test,
  },
  {
    initialRouteName: "HomeScreen",
    headerMode: "none",
    transitionConfig,
  },
)

const AppContainer = createAppContainer(ContentNavigator)

export class RootNavigator extends React.Component {
  public render() {
    if (Platform.OS !== "ios") {
      StatusBar.setBackgroundColor(appTheme.statusBarColor)
    }
    return (
      <Root>
        <AppContainer />
      </Root>
    )
  }
}
