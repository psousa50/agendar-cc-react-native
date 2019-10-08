import { View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { LocationsMap, LocationsType, MapLocation } from "../common/LocationsMap"
import { ButtonIcons } from "../common/ToolbarIcons"
import { useGlobalState } from "../GlobalStateProvider"
import { IrnTableFilter } from "../state/models"
import { globalStateSelectors, GlobalStateSelectors } from "../state/selectors"
import { navigate } from "./screens"

export const SelectLocationByMapScreen: React.FC<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState, globalDispatch] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)

  const updateGlobalFilterForEdit = (filter: Partial<IrnTableFilter>) => {
    globalDispatch({
      type: "IRN_TABLES_SET_FILTER_FOR_EDIT",
      payload: { filter: { ...stateSelectors.getIrnTablesFilterForEdit, ...filter } },
    })
  }

  const goBack = () => {
    navigation.goBack()
  }

  const irnFilter = stateSelectors.getIrnTablesFilterForEdit

  const onLocationPress = (type: LocationsType, mapLocation: MapLocation) => {
    if (type === "District") {
      updateGlobalFilterForEdit({ districtId: mapLocation.id, countyId: undefined })
    }
    if (type === "County") {
      updateGlobalFilterForEdit({ districtId: irnFilter.districtId, countyId: mapLocation.id })
    }
    if (type === "Place") {
      updateGlobalFilterForEdit({ placeName: mapLocation.name })
    }
  }

  const { mapLocations, locationType } = getMapLocations(stateSelectors)(irnFilter)

  const renderContent = () => {
    return (
      <View style={styles.container}>
        <LocationsMap mapLocations={mapLocations} locationType={locationType} onLocationPress={onLocationPress} />
      </View>
    )
  }

  return (
    <AppScreen
      {...props}
      content={renderContent}
      title="Localização"
      showAds={false}
      right={() => ButtonIcons.Checkmark(goBack)}
    />
  )
}

const getMapLocations = (stateSelectors: GlobalStateSelectors) => (irnFilter: IrnTableFilter) => {
  const { districtId, countyId, region } = irnFilter
  const districtLocations = stateSelectors
    .getDistricts(region)
    .filter(d => !districtId || d.districtId === districtId)
    .map(d => ({ ...d, id: d.districtId }))

  const countyLocations = stateSelectors
    .getCounties(districtId)
    .filter(
      c => districtLocations.map(dl => dl.districtId).includes(c.districtId) && (!countyId || c.countyId === countyId),
    )
    .map(c => ({ ...c, id: c.countyId }))

  const irnPlacesLocations = stateSelectors
    .getIrnPlaces()
    .filter(
      p =>
        countyLocations.map(cl => cl.countyId).includes(p.countyId) &&
        (!countyId || p.countyId === countyId) &&
        (!districtId || p.districtId === districtId),
    )

  const locationType: LocationsType =
    districtLocations.length !== 1 ? "District" : countyLocations.length !== 1 ? "County" : "Place"

  const mapLocations =
    locationType === "District" ? districtLocations : locationType === "County" ? countyLocations : irnPlacesLocations

  return { mapLocations, locationType }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
