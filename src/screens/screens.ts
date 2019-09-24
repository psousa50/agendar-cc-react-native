import { NavigationParams, NavigationRoute, NavigationScreenProp } from "react-navigation"

export type AppScreenName =
  | "HomeScreen"
  | "IrnDateFilterScreen"
  | "IrnLocationFilterScreen"
  | "IrnTablesByDateScreen"
  | "IrnTablesDayScheduleScreen"
  | "SelectedIrnTableScreen"

export const navigate = (navigation: NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams>) => ({
  goBack: () => navigation.goBack(),
  goTo: (screen: AppScreenName) => navigation.navigate(screen),
})
