import React, { useState } from "react"
import { NavigationEvents } from "react-navigation"
import { NavigationEventPayload } from "react-navigation"
import { AppModalScreen, AppScreenProps } from "../../components/common/AppScreen"
import { ButtonIcons } from "../../components/common/ToolbarIcons"
import { useGlobalState } from "../../GlobalStateProvider"
import { IrnTableFilter, IrnTableFilterLocation } from "../../state/models"
import { globalStateSelectors } from "../../state/selectors"
import { normalizeLocation } from "../../utils/location"
import { navigate } from "../screens"
import { SelectLocationView } from "./SelectLocationView"

export const SelectLocationScreen: React.FC<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState, globalDispatch] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)

  const [location, setLocation] = useState(stateSelectors.getIrnTablesFilter)

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

  const onSelectLocationOnMap = () => {
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
        onSelectLocationOnMap={onSelectLocationOnMap}
      />
    </AppModalScreen>
  )
}
