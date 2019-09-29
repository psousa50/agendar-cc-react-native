import React from "react"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { LocationsMap, LocationsType, MapLocation } from "../common/LocationsMap"
import { ButtonIcons } from "../common/ToolbarIcons"
import { useGlobalState } from "../GlobalStateProvider"
import {
  getIrnTableResultSummary,
  irnTableResultsAreEqual,
  selectOneIrnTableResultByClosestDate,
  selectOneIrnTableResultByClosestPlace,
} from "../irnTables/main"
import { IrnPlaces } from "../irnTables/models"
import { IrnTableFilterState } from "../state/models"
import { globalStateSelectors } from "../state/selectors"
import { navigate } from "./screens"

export const IrnTablesResultsMapScreen: React.FunctionComponent<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState, globalDispatch] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)

  const irnFilter = stateSelectors.getIrnTablesFilter
  const irnTables = stateSelectors.getIrnTables

  const irnTableResultByClosestDate = selectOneIrnTableResultByClosestDate(stateSelectors)(irnTables, irnFilter)
  const irnTableResultByClosestPlace = selectOneIrnTableResultByClosestPlace(stateSelectors)(irnTables, irnFilter)
  const irnTableResultSummary = getIrnTableResultSummary(irnTables)

  const closestAreTheSame =
    irnTableResultByClosestDate && irnTableResultByClosestPlace
      ? irnTableResultsAreEqual(irnTableResultByClosestDate, irnTableResultByClosestPlace)
      : false

  const irnPlaces = irnTableResultSummary.irnPlaceNames.map(stateSelectors.getIrnPlace).filter(p => !!p) as IrnPlaces

  const mapLocations = irnPlaces.map(p => ({
    name: p.name,
    gpsLocation: p.gpsLocation,
    pinColor:
      irnTableResultByClosestPlace && p.name === irnTableResultByClosestPlace.placeName
        ? "yellow"
        : !closestAreTheSame && irnTableResultByClosestDate && p.name === irnTableResultByClosestDate.placeName
        ? "green"
        : undefined,
  }))

  const updateGlobalFilter = (filter: Partial<IrnTableFilterState>) => {
    globalDispatch({
      type: "IRN_TABLES_SET_FILTER",
      payload: { filter },
    })
  }

  const goBack = () => {
    navigation.goBack()
  }

  const onLocationPress = (_: LocationsType, mapLocation: MapLocation) => {
    updateGlobalFilter({ selectedPlaceName: mapLocation.name })
    goBack()
  }

  const renderContent = () => (
    <LocationsMap mapLocations={mapLocations} locationType={"Place"} onLocationPress={onLocationPress} />
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
