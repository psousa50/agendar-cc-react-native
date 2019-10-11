import React, { useState } from "react"
import { NavigationEvents } from "react-navigation"
import { NavigationEventPayload } from "react-navigation"
import { useGlobalState } from "../../GlobalStateProvider"
import { IrnTableFilter, IrnTableFilterLocation } from "../../state/models"
import { globalStateSelectors } from "../../state/selectors"
import { normalizeLocation } from "../../utils/location"
import { AppModalScreen, AppScreenProps } from "../common/AppScreen"
import { ButtonIcons } from "../common/ToolbarIcons"
import { SelectLocationView } from "../views/SelectLocationView"
import { navigate } from "./screens"

export const SelectLocationScreen: React.FC<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState, globalDispatch] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)
  const initialLocation = stateSelectors.getIrnTablesFilter
  const [location, setLocation] = useState(initialLocation)

  const updateGlobalFilter = (filter: Partial<IrnTableFilter>) => {
    globalDispatch({
      type: "IRN_TABLES_UPDATE_FILTER",
      payload: { filter },
    })
  }

  const goBack = () => {
    navigation.goBack()
  }

  const updateGlobalFilterAndGoBack = () => {
    updateGlobalFilter(location)
    goBack()
  }

  const onLocationChange = (newLocation: IrnTableFilterLocation) => {
    setLocation(normalizeLocation(stateSelectors)(newLocation))
  }

  const onSelectOnMap = () => {
    navigation.goTo("SelectLocationByMapScreen", { location })
  }

  const onWillFocus = (payload: NavigationEventPayload) => {
    const locationParam = payload.state.params && payload.state.params.location
    locationParam && setLocation(normalizeLocation(stateSelectors)(locationParam))
  }

  return (
    <AppModalScreen {...props} right={() => ButtonIcons.Checkmark(() => updateGlobalFilterAndGoBack())}>
      <NavigationEvents onWillFocus={onWillFocus} />
      <SelectLocationView
        location={location}
        referenceData={stateSelectors}
        onLocationChange={onLocationChange}
        onSelectOnMap={onSelectOnMap}
      />
    </AppModalScreen>
  )
}
