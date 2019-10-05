import React from "react"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { LocationsMap, LocationsType, MapLocation } from "../common/LocationsMap"
import { ButtonIcons } from "../common/ToolbarIcons"
import { useGlobalState } from "../GlobalStateProvider"
import { getIrnTableResultSummary } from "../irnTables/main"
import { Counties, Districts, IrnPlaces } from "../irnTables/models"
import { IrnTableFilterState } from "../state/models"
import { globalStateSelectors, GlobalStateSelectors } from "../state/selectors"
import { navigate } from "./screens"

export const IrnTablesResultsMapScreen: React.FunctionComponent<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState, globalDispatch] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)

  const irnFilter = stateSelectors.getIrnTablesFilter
  const { mapLocations, locationType } = getMapLocations(stateSelectors)()

  const updateGlobalFilterForEdit = (filter: Partial<IrnTableFilterState>) => {
    globalDispatch({
      type: "IRN_TABLES_SET_FILTER_FOR_EDIT",
      payload: { filter: { ...stateSelectors.getIrnTablesFilterForEdit, ...filter } },
    })
  }

  const goBack = () => {
    navigation.goBack()
  }

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

const getMapLocations = (stateSelectors: GlobalStateSelectors) => () => {
  const irnFilter = stateSelectors.getIrnTablesFilter
  const irnTables = stateSelectors.getIrnTables
  const irnTableResultSummary = getIrnTableResultSummary(irnTables)

  const { districtId, countyId } = irnFilter

  const districts = irnTableResultSummary.districtIds.map(stateSelectors.getDistrict).filter(d => !!d) as Districts
  const counties = irnTableResultSummary.countyIds.map(stateSelectors.getCounty).filter(d => !!d) as Counties
  const irnPlaces = irnTableResultSummary.irnPlaceNames.map(stateSelectors.getIrnPlace).filter(d => !!d) as IrnPlaces

  const districtLocations = districts
    .filter(d => !districtId || d.districtId === districtId)
    .map(d => ({ ...d, id: d.districtId }))

  const countyLocations = counties
    .filter(c => !districtId || (c.districtId === districtId && (!countyId || c.countyId === countyId)))
    .map(c => ({ ...c, id: c.countyId }))

  const irnPlacesLocations = irnPlaces.filter(
    p =>
      (!districtId || p.districtId === districtId) &&
      (!countyId || p.countyId === countyId) &&
      (!districtId || p.districtId === districtId),
  )

  const locationType: LocationsType =
    districtLocations.length !== 1 ? "District" : countyLocations.length !== 1 ? "County" : "Place"

  const mapLocations =
    locationType === "District" ? districtLocations : locationType === "County" ? countyLocations : irnPlacesLocations

  return { mapLocations, locationType }
}
