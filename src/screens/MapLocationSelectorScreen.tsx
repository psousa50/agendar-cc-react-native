import React from "react"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { LocationsMap, LocationsType, MapLocation } from "../common/LocationsMap"
import { ButtonIcons } from "../common/ToolbarIcons"
import { useGlobalState } from "../GlobalStateProvider"
import { filterTable, getIrnTableResultSummary } from "../irnTables/main"
import { County, District, IrnPlace } from "../irnTables/models"
import { IrnTableFilterState } from "../state/models"
import { globalStateSelectors } from "../state/selectors"
import { navigate } from "./screens"

export const MapLocationSelectorScreen: React.FunctionComponent<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState, globalDispatch] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)

  const irnFilter = stateSelectors.getIrnTablesFilter
  const irnTables = stateSelectors.getIrnTables.filter(filterTable(irnFilter))
  const irnTableResultSummary = getIrnTableResultSummary(irnTables)

  const { countyId, districtId } = irnFilter
  const districtLocations = irnTableResultSummary.districtIds
    .filter(d => !districtId || d === districtId)
    .map(stateSelectors.getDistrict)
    .filter(d => !!d)
    .map(d => d as District)
    .map(d => ({ ...d, id: d.districtId }))

  const countyLocations = irnTableResultSummary.countyIds
    .map(stateSelectors.getCounty)
    .filter(c => !!c)
    .map(c => c as County)
    .filter(c => (!countyId || c.countyId === countyId) && (!districtId || c.districtId === districtId))
    .map(c => ({ ...c, id: c.countyId }))

  const irnPlacesLocations = irnTableResultSummary.irnPlaceNames
    .map(stateSelectors.getIrnPlace)
    .filter(p => !!p)
    .map(p => p as IrnPlace)
    .filter(p => (!countyId || p.countyId === countyId) && (!districtId || p.districtId === districtId))

  const locationType: LocationsType =
    districtLocations.length !== 1 ? "District" : countyLocations.length !== 1 ? "County" : "Place"

  const mapLocations =
    locationType === "District" ? districtLocations : locationType === "County" ? countyLocations : irnPlacesLocations

  const updateGlobalFilter = (filter: Partial<IrnTableFilterState>) => {
    globalDispatch({
      type: "IRN_TABLES_SET_FILTER",
      payload: { filter },
    })
  }

  const goBack = () => {
    navigation.goBack()
  }

  const onLocationPress = (type: LocationsType, mapLocation: MapLocation) => {
    if (type === "District") {
      updateGlobalFilter({ districtId: mapLocation.id })
    }
    if (type === "County") {
      updateGlobalFilter({ countyId: mapLocation.id })
    }
    if (type === "Place") {
      updateGlobalFilter({ placeName: mapLocation.name })
      goBack()
    }
  }

  const renderContent = () => (
    <LocationsMap mapLocations={mapLocations} locationType={locationType} onLocationPress={onLocationPress} />
  )

  return (
    <AppScreen
      {...props}
      content={renderContent}
      title="Resultados"
      showAds={false}
      right={() => ButtonIcons.Checkmark(() => goBack())}
    />
  )
}
