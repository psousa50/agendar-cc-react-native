import React, { useState } from "react"
import { useGlobalState } from "../../GlobalStateProvider"
import { IrnTableFilterLocation } from "../../state/models"
import { globalStateSelectors } from "../../state/selectors"
import { getMapLocations } from "../../utils/location"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { ButtonIcons } from "../common/ToolbarIcons"
import { SelectLocationByMapView } from "../views/SelectLocationByMapView"
import { navigate } from "./screens"

export const SelectLocationByMapScreen: React.FC<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)

  const initialLocation = navigation.getParam("location") as IrnTableFilterLocation
  const [location, setLocation] = useState(initialLocation)

  const goBack = (newLocation?: IrnTableFilterLocation) => {
    navigation.goTo("SelectLocationScreen", { location: newLocation || location })
  }

  const onLocationChange = (newLocation: IrnTableFilterLocation) => {
    const { mapLocations, locationType } = getMapLocations(stateSelectors)(newLocation)

    if (locationType === "Place" && mapLocations.length === 1) {
      goBack(newLocation)
    } else {
      setLocation(newLocation)
    }
  }
  return (
    <AppScreen {...props} right={() => ButtonIcons.Checkmark(goBack)}>
      <SelectLocationByMapView location={location} referenceData={stateSelectors} onLocationChange={onLocationChange} />
    </AppScreen>
  )
}
