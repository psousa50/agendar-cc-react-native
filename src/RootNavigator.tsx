import { Root } from "native-base"
import React from "react"
import { Animated, Easing, Platform, StatusBar } from "react-native"
import { createAppContainer } from "react-navigation"
import { NavigationSceneRendererProps } from "react-navigation"
import { createStackNavigator } from "react-navigation"
import { IrnFiltersScreen } from "./screens/IrnFilters"
import { SelectCountiesScreen } from "./screens/SelectCounties"
import { SelectDistrictsScreen } from "./screens/SelectDistricts"
import { ShowIrnTablesScreen } from "./screens/ShowIrnTables"
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
    IrnFilters: IrnFiltersScreen,
    SelectDistricts: SelectDistrictsScreen,
    SelectCounties: SelectCountiesScreen,
    ShowIrnTables: ShowIrnTablesScreen,
  },
  {
    initialRouteName: "SelectDistricts",
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
