import React, { useState } from "react"
import { useSelector } from "react-redux"
import { AppModalScreen, AppScreenProps } from "../../components/common/AppScreen"
import { ButtonIcons } from "../../components/common/ToolbarIcons"
import { i18n } from "../../localization/i18n"
import { buildIrnPlacesProxy } from "../../state/irnPlacesSlice"
import { IrnTableFilterLocation } from "../../state/models"
import { buildReferenceDataProxy } from "../../state/referenceDataSlice"
import { RootState } from "../../state/rootReducer"
import { getFilteredLocations } from "../../utils/location"
import { enhancedNavigation } from "../screens"
import { SelectLocationByMapView } from "./SelectLocationByMapView"

export const SelectLocationByMapScreen: React.FC<AppScreenProps> = props => {
  const navigation = enhancedNavigation(props.navigation)

  const { irnPlacesProxy, referenceDataProxy } = useSelector((state: RootState) => ({
    irnTables: state.irnTablesData.irnTables,
    refineFilter: state.irnTablesData.refineFilter,
    loading: state.irnTablesData.loading || state.referenceData.loading,
    irnPlacesProxy: buildIrnPlacesProxy(state.irnPlacesData),
    referenceDataProxy: buildReferenceDataProxy(state.referenceData),
  }))

  const initialLocation = navigation.getParam("location", undefined) as IrnTableFilterLocation
  const [location, setLocation] = useState(initialLocation)

  const goBack = (newLocation?: IrnTableFilterLocation) => {
    navigation.goTo("SelectLocationScreen", { location: newLocation || location })
  }

  const onLocationChange = (newLocation: IrnTableFilterLocation) => {
    const { filteredIrnPlaces } = getFilteredLocations(
      referenceDataProxy.getDistricts(),
      referenceDataProxy.getCounties(),
      irnPlacesProxy.getIrnPlaces(),
      newLocation,
    )

    if (filteredIrnPlaces.length === 1) {
      goBack(newLocation)
    } else {
      setLocation(newLocation)
    }
  }

  const selectLocationByMapViewProps = {
    location,
    irnPlacesProxy,
    referenceDataProxy,
    onLocationChange,
  }
  return (
    <AppModalScreen
      {...props}
      title={i18n.t("Title.SelectLocationByMap")}
      right={() => ButtonIcons.Checkmark(() => goBack())}
    >
      <SelectLocationByMapView {...selectLocationByMapViewProps} />
    </AppModalScreen>
  )
}
