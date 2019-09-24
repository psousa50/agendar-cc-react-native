import { NavigationParams, NavigationRoute, NavigationScreenProp } from "react-navigation"

export type AppScreenName =
  | "HomeScreen"
  | "IrnLocationFilterScreen"
  | "IrnTablesByDateScreen"
  | "IrnTablesDayScheduleScreen"
  | "SelectedIrnTableScreen"

export const navigate = (navigation: NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams>) => (
  screen: AppScreenName,
) => navigation.navigate(screen)
