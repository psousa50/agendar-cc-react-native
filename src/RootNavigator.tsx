import { Root } from "native-base"
import React from "react"
import { Animated, Easing, Platform, StatusBar } from "react-native"
import { createStackNavigator } from "react-navigation"
import { createAppContainer } from "react-navigation"
import { NavigationSceneRendererProps } from "react-navigation"
import { HomeScreen } from "./components/screens/HomeScreen"
import { IrnTablesResultsScreen } from "./components/screens/IrnTablesResultsScreen"
import { SelectAnotherDateScreen } from "./components/screens/SelectAnotherDateScreen"
import { SelectAnotherLocationScreen } from "./components/screens/SelectAnotherLocationScreen"
import { SelectDatePeriodScreen } from "./components/screens/SelectDatePeriodScreen"
import { SelectedIrnTableScreen } from "./components/screens/SelectedIrnTableScreen"
import { SelectLocationByMapScreen } from "./components/screens/SelectLocationByMapScreen"
import { SelectLocationScreen } from "./components/screens/SelectLocationScreen"
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
    SelectAnotherDateScreen,
    IrnTablesResultsScreen,
    SelectAnotherLocationScreen,
    SelectedIrnTableScreen,
    SelectLocationScreen,
    SelectLocationByMapScreen,
    SelectDatePeriodScreen,
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
