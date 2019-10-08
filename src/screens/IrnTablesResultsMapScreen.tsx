import { isNil } from "ramda"
import React, { useState } from "react"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { LocationsMap, LocationsType, MapLocation } from "../common/LocationsMap"
import { ButtonIcons } from "../common/ToolbarIcons"
import { useGlobalState } from "../GlobalStateProvider"
import { getIrnTableResultSummary, refineFilterTable } from "../irnTables/main"
import { Counties, Districts, IrnPlaces } from "../irnTables/models"
import { IrnTableRefineFilter } from "../state/models"
import { globalStateSelectors, GlobalStateSelectors } from "../state/selectors"
import { navigate } from "./screens"

export const IrnTablesResultsMapScreen: React.FunctionComponent<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState, globalDispatch] = useGlobalState()
  const initialFilter: IrnTableRefineFilter = {}
  const [filter, setFilter] = useState(initialFilter)
  const stateSelectors = globalStateSelectors(globalState)

  const updateRefineFilter = (newFilter: Partial<IrnTableRefineFilter>) => {
    globalDispatch({
      type: "IRN_TABLES_SET_REFINE_FILTER",
      payload: { filter: newFilter },
    })
  }

  const updateFilter = (newFilter: Partial<IrnTableRefineFilter>) => {
    setFilter({ ...filter, ...newFilter })
  }

  const goBack = () => {
    navigation.goBack()
  }

  const updateRefineFilterAndGoBack = () => {
    updateRefineFilter(filter)
    goBack()
  }

  const checkOnlyOneResult = (newFilter: IrnTableRefineFilter) => {
    const { mapLocations, locationType } = getMapLocations(stateSelectors)({ ...filter, ...newFilter })
    console.log("(locationType=====>", locationType)
    if (locationType === "Place" && mapLocations.length === 1) {
      updateRefineFilter(newFilter)
      goBack()
    } else {
      updateFilter(newFilter)
    }
  }

  const onLocationPress = (type: LocationsType, mapLocation: MapLocation) => {
    if (type === "District") {
      checkOnlyOneResult({ ...filter, districtId: mapLocation.id, countyId: undefined })
    }
    if (type === "County") {
      checkOnlyOneResult({ ...filter, countyId: mapLocation.id })
    }
    if (type === "Place") {
      updateRefineFilter({ ...filter, placeName: mapLocation.name })
      goBack()
    }
  }

  const renderContent = () => {
    const { mapLocations, locationType } = getMapLocations(stateSelectors)(filter)
    return <LocationsMap mapLocations={mapLocations} locationType={locationType} onLocationPress={onLocationPress} />
  }

  return (
    <AppScreen
      {...props}
      content={renderContent}
      title="Resultados"
      showAds={false}
      right={() => ButtonIcons.Checkmark(() => updateRefineFilterAndGoBack())}
    />
  )
}

const getMapLocations = (stateSelectors: GlobalStateSelectors) => (filter: IrnTableRefineFilter) => {
  const irnTables = stateSelectors.getIrnTables.filter(refineFilterTable(filter))
  const irnTableResultSummary = getIrnTableResultSummary(irnTables)

  const { districtId, countyId, placeName } = filter

  const districts = irnTableResultSummary.districtIds.map(stateSelectors.getDistrict).filter(d => !!d) as Districts
  const counties = irnTableResultSummary.countyIds.map(stateSelectors.getCounty).filter(d => !!d) as Counties
  const irnPlaces = irnTableResultSummary.irnPlaceNames.map(stateSelectors.getIrnPlace).filter(d => !!d) as IrnPlaces

  // const hasCounties = (district: District) =>
  const districtLocations = districts
    .filter(d => isNil(districtId) || d.districtId === districtId)
    .map(d => ({ ...d, id: d.districtId }))

  const countyLocations = counties
    .filter(c => isNil(districtId) || (c.districtId === districtId && (isNil(countyId) || c.countyId === countyId)))
    .map(c => ({ ...c, id: c.countyId }))

  const irnPlacesLocations = irnPlaces.filter(
    p =>
      (isNil(districtId) || p.districtId === districtId) &&
      (isNil(countyId) || p.countyId === countyId) &&
      (isNil(placeName) || p.name === placeName),
  )

  console.log("FILTER=====>", filter)
  console.log("D=====>", districtLocations)
  console.log("C=====>", countyLocations)
  console.log("P=====>", irnPlacesLocations)

  const locationType: LocationsType =
    districtLocations.length !== 1 ? "District" : countyLocations.length !== 1 ? "County" : "Place"

  const mapLocations =
    locationType === "District" ? districtLocations : locationType === "County" ? countyLocations : irnPlacesLocations

  return { mapLocations, locationType }
}
