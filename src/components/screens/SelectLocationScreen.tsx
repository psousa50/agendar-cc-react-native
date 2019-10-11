import React, { useState } from "react"
import { useGlobalState } from "../../GlobalStateProvider"
import { normalizeFilter } from "../../state/main"
import { IrnTableFilter, IrnTableFilterLocation } from "../../state/models"
import { globalStateSelectors } from "../../state/selectors"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { ButtonIcons } from "../common/ToolbarIcons"
import { SelectLocationView } from "../views/SelectLocationView"
import { navigate } from "./screens"

export const SelectLocationScreen: React.FC<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState, globalDispatch] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)
  const initialLocation = navigation.getParam("location", stateSelectors.getIrnTablesFilter)
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
    setLocation(normalizeFilter(newLocation))
  }

  const onSelectOnMap = () => {
    navigation.goTo("SelectLocationByMapScreen", { location })
  }

  return (
    <AppScreen {...props} right={() => ButtonIcons.Checkmark(() => updateGlobalFilterAndGoBack())}>
      <SelectLocationView
        location={location}
        referenceData={stateSelectors}
        onLocationChange={onLocationChange}
        onSelectOnMap={onSelectOnMap}
      />
    </AppScreen>
  )
}
