import { View } from "native-base"
import { isNil } from "ramda"
import React, { useState } from "react"
import { StyleSheet } from "react-native"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { LocationsMap, LocationsType, MapLocation } from "../common/LocationsMap"
import { ButtonIcons } from "../common/ToolbarIcons"
import { useGlobalState } from "../GlobalStateProvider"
import { IrnTableFilter, IrnTableRefineFilter } from "../state/models"
import { globalStateSelectors, GlobalStateSelectors } from "../state/selectors"
import { navigate } from "./screens"

export const SelectLocationByMapScreen: React.FC<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState, globalDispatch] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)

  const [filter, setFilter] = useState(stateSelectors.getIrnTablesFilterForEdit)

  const updateGlobalFilterForEdit = (newFilter: Partial<IrnTableFilter>) => {
    globalDispatch({
      type: "IRN_TABLES_SET_FILTER_FOR_EDIT",
      payload: { filter: { ...stateSelectors.getIrnTablesFilterForEdit, ...newFilter } },
    })
  }

  const updateFilter = (newFilter: Partial<IrnTableRefineFilter>) => {
    setFilter({ ...filter, ...newFilter })
  }

  const goBack = () => {
    navigation.goBack()
  }

  const updateGlobalFilterForEditAndGoBack = () => {
    updateGlobalFilterForEdit(filter)
    goBack()
  }

  const checkOnlyOneResult = (newFilter: IrnTableRefineFilter) => {
    const { mapLocations, locationType } = getMapLocations(stateSelectors)({
      ...filter,
      ...newFilter,
    })
    if (locationType === "Place" && mapLocations.length === 1) {
      updateGlobalFilterForEdit(newFilter)
      goBack()
    } else {
      updateFilter(newFilter)
    }
  }

  const onLocationPress = (type: LocationsType, mapLocation: MapLocation) => {
    if (type === "District") {
      checkOnlyOneResult({ districtId: mapLocation.id, countyId: undefined })
    }
    if (type === "County") {
      checkOnlyOneResult({ countyId: mapLocation.id })
    }
    if (type === "Place") {
      updateGlobalFilterForEdit({ placeName: mapLocation.name })
      goBack()
    }
  }

  const renderContent = () => {
    const { mapLocations, locationType } = getMapLocations(stateSelectors)(filter)

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
      right={() => ButtonIcons.Checkmark(updateGlobalFilterForEditAndGoBack)}
    />
  )
}

const getMapLocations = (stateSelectors: GlobalStateSelectors) => (filter: IrnTableFilter) => {
  const { districtId, countyId, region } = filter
  const districtLocations = stateSelectors
    .getDistricts(region)
    .filter(d => isNil(districtId) || d.districtId === districtId)
    .map(d => ({ ...d, id: d.districtId }))

  const countyLocations = stateSelectors
    .getCounties(districtId)
    .filter(c => isNil(countyId) || c.countyId === countyId)
    .map(c => ({ ...c, id: c.countyId }))

  const irnPlacesLocations = stateSelectors
    .getIrnPlaces()
    .filter(p => (isNil(districtId) || p.districtId === districtId) && (isNil(countyId) || p.countyId === countyId))

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
