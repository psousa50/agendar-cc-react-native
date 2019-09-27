import React from "react"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { LocationsMap, LocationsType, MapLocation } from "../common/LocationsMap"
import { useGlobalState } from "../GlobalStateProvider"
import { IrnTableFilterState } from "../state/models"
import { globalStateSelectors } from "../state/selectors"
import { navigate } from "./screens"

export const MapLocationSelectorScreen: React.FunctionComponent<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState, globalDispatch] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)

  const irnFilter = stateSelectors.getIrnTablesFilter

  const { countyId, districtId } = irnFilter

  const mapLocations = !districtId
    ? stateSelectors
        .getDistricts()
        .filter(t => ![1, 13].includes(t.districtId))
        .map(d => ({ ...d, id: d.districtId }))
    : !countyId
    ? stateSelectors.getCounties(districtId).map(c => ({ ...c, id: c.countyId }))
    : stateSelectors.getIrnPlaces(countyId)

  const locationType: LocationsType = !districtId ? "District" : !countyId ? "County" : "Place"

  const updateGlobalFilter = (filter: Partial<IrnTableFilterState>) => {
    globalDispatch({
      type: "IRN_TABLES_SET_FILTER",
      payload: { filter },
    })
  }

  const onLocationPress = (type: LocationsType, mapLocation: MapLocation) => {
    if (type === "District") {
      updateGlobalFilter({ districtId: mapLocation.id })
    }
    if (type === "County") {
      updateGlobalFilter({ countyId: mapLocation.id })
    }
    if (type === "Place") {
      updateGlobalFilter({ irnPlaceName: mapLocation.name })
      navigation.goBack()
    }
  }

  const renderContent = () => (
    <LocationsMap mapLocations={mapLocations} locationType={locationType} onLocationPress={onLocationPress} />
  )

  return <AppScreen {...props} content={renderContent} title="Resultados" showAds={false} />
}
