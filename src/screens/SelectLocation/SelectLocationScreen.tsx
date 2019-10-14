import React, { useState } from "react"
import { NavigationEventPayload } from "react-navigation"
import { NavigationEvents } from "react-navigation"
import { useDispatch, useSelector } from "react-redux"
import { AppModalScreen, AppScreenProps } from "../../components/common/AppScreen"
import { ButtonIcons } from "../../components/common/ToolbarIcons"
import { buildIrnPlacesProxy } from "../../state/irnPlacesSlice"
import { updateFilter } from "../../state/irnTablesSlice"
import { IrnTableFilterLocation } from "../../state/models"
import { buildReferenceDataProxy } from "../../state/referenceDataSlice"
import { RootState } from "../../state/rootReducer"
import { normalizeLocation } from "../../utils/location"
import { enhancedNavigation } from "../screens"
import { SelectLocationView } from "./SelectLocationView"

export const SelectLocationScreen: React.FC<AppScreenProps> = props => {
  const navigation = enhancedNavigation(props.navigation)

  const dispatch = useDispatch()

  const { filter, irnPlacesProxy, referenceDataProxy } = useSelector((state: RootState) => ({
    irnTables: state.irnTablesData.irnTables,
    filter: state.irnTablesData.filter,
    refineFilter: state.irnTablesData.refineFilter,
    loading: state.irnTablesData.loading || state.referenceData.loading,
    irnPlacesProxy: buildIrnPlacesProxy(state.irnPlacesData),
    referenceDataProxy: buildReferenceDataProxy(state.referenceData),
  }))

  const [location, setLocation] = useState(filter)

  const goBack = () => {
    navigation.goBack()
  }

  const updateGlobalFilterAndGoBack = () => {
    dispatch(updateFilter(location))
    goBack()
  }

  const onLocationChange = (newLocation: IrnTableFilterLocation) => {
    setLocation(normalizeLocation(referenceDataProxy, irnPlacesProxy)(newLocation))
  }

  const onSelectLocationOnMap = () => {
    navigation.goTo("SelectLocationByMapScreen", { location })
  }

  const onWillFocus = (payload: NavigationEventPayload) => {
    const locationParam = payload.state.params && payload.state.params.location
    locationParam && setLocation(normalizeLocation(referenceDataProxy, irnPlacesProxy)(locationParam))
  }

  return (
    <AppModalScreen {...props} right={() => ButtonIcons.Checkmark(() => updateGlobalFilterAndGoBack())}>
      <NavigationEvents onWillFocus={onWillFocus} />
      <SelectLocationView
        location={location}
        referenceDataProxy={referenceDataProxy}
        onLocationChange={onLocationChange}
        onSelectLocationOnMap={onSelectLocationOnMap}
      />
    </AppModalScreen>
  )
}
