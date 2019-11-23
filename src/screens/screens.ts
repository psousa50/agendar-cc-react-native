import { NavigationAction, NavigationParams, NavigationRoute, NavigationScreenProp } from "react-navigation"

export type AppScreenName =
  | "HomeScreen"
  | "IrnTablesResultsScreen"
  | "ScheduleIrnTableScreen"
  | "SelectAnotherDateScreen"
  | "SelectAnotherLocationScreen"
  | "SelectAnotherTimeSlotScreen"
  | "SelectDatePeriodScreen"
  | "SelectedIrnTableScreen"
  | "SelectLocationByMapScreen"
  | "SelectLocationScreen"
  | "Test"

export const enhancedNavigation = (
  navigation: NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams>,
) => ({
  ...navigation,
  goTo: (screen: AppScreenName, params?: NavigationParams, action?: NavigationAction) =>
    navigation.navigate(screen, params, action),
})

export type EnhancedNavigation = typeof enhancedNavigation
