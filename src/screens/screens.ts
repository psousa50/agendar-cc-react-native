import { NavigationAction, NavigationParams, NavigationRoute, NavigationScreenProp } from "react-navigation"

export type AppScreenName =
  | "HomeScreen"
  | "IrnTablesResultsScreen"
  | "SelectAnotherDateScreen"
  | "SelectAnotherLocationScreen"
  | "SelectedIrnTableScreen"
  | "SelectLocationByMapScreen"
  | "SelectLocationScreen"
  | "Test"

export const navigate = (navigation: NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams>) => ({
  ...navigation,
  goTo: (screen: AppScreenName, params?: NavigationParams, action?: NavigationAction) =>
    navigation.navigate(screen, params, action),
})