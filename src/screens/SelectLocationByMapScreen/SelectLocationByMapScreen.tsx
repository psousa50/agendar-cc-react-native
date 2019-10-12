import React, { useState } from "react"
import { AppModalScreen, AppScreenProps } from "../../components/common/AppScreen"
import { ButtonIcons } from "../../components/common/ToolbarIcons"
import { useGlobalState } from "../../GlobalStateProvider"
import { IrnTableFilterLocation } from "../../state/models"
import { globalStateSelectors } from "../../state/selectors"
import { getMapLocations } from "../../utils/location"
import { navigate } from "../screens"
import { SelectLocationByMapView } from "./SelectLocationByMapView"

export const SelectLocationByMapScreen: React.FC<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)

  const initialLocation = navigation.getParam("location", undefined) as IrnTableFilterLocation
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
    <AppModalScreen {...props} right={() => ButtonIcons.Checkmark(() => goBack())}>
      <SelectLocationByMapView location={location} referenceData={stateSelectors} onLocationChange={onLocationChange} />
    </AppModalScreen>
  )
}
