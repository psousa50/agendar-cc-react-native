import { NavigationParams, NavigationRoute, NavigationScreenProp } from "react-navigation"

export type AppScreenName =
  | "HomeScreen"
  | "IrnTablesByDateScreen"
  | "IrnTablesResultsScreen"
  | "IrnTablesResultsMapScreen"
  | "SelectedIrnTableScreen"
  | "SelectDateTimeScreen"
  | "SelectLocationScreen"
  | "SelectLocationByMapScreen"
  | "Test"

export const navigate = (navigation: NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams>) => ({
  ...navigation,
  goTo: (screen: AppScreenName) => navigation.navigate(screen),
})
