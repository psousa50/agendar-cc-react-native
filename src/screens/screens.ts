import { NavigationParams, NavigationRoute, NavigationScreenProp } from "react-navigation"

export type AppScreenName =
  | "HomeScreen"
  | "IrnTablesByDateScreen"
  | "IrnTablesDayScheduleScreen"
  | "IrnTablesResultsScreen"
  | "IrnTablesResultsMapScreen"
  | "MapLocationSelectorScreen"
  | "SelectedIrnTableScreen"
  | "SelectIrnServiceScreen"
  | "SelectDateTimeScreen"
  | "SelectLocationScreen"
  | "SelectLocationByMapScreen"
  | "Test"

export const navigate = (navigation: NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams>) => ({
  ...navigation,
  goTo: (screen: AppScreenName) => navigation.navigate(screen),
})
