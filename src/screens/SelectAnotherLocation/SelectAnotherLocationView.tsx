import React from "react"
import { LocationsMap, MapLocation } from "../../components/common/LocationsMap"
import { byRefineFilter, getIrnTableResultSummary } from "../../irnTables/main"
import { Counties, Districts, IrnPlaces, IrnRepositoryTables } from "../../irnTables/models"
import { IrnPlacesProxy } from "../../state/irnPlacesSlice"
import { IrnTableRefineFilterLocation } from "../../state/models"
import { ReferenceDataProxy } from "../../state/referenceDataSlice"
import { getAllMapLocations } from "../../utils/location"

interface SelectAnotherLocationViewProps {
  refineLocation: IrnTableRefineFilterLocation
  irnTables: IrnRepositoryTables
  irnPlacesProxy: IrnPlacesProxy
  referenceDataProxy: ReferenceDataProxy
  onLocationChange: (location: IrnTableRefineFilterLocation) => void
}
export const SelectAnotherLocationView: React.FC<SelectAnotherLocationViewProps> = ({
  irnTables,
  refineLocation,
  irnPlacesProxy,
  onLocationChange,
  referenceDataProxy,
}) => {
  const checkOnlyOneResult = (newLocation: IrnTableRefineFilterLocation) => {
    const irnTablesFiltered = irnTables.filter(byRefineFilter({ ...refineLocation, ...newLocation }))
    const irnTableResultSummary = getIrnTableResultSummary(irnTablesFiltered)

    onLocationChange(
      irnTableResultSummary.irnPlaceNames.length === 1
        ? { ...newLocation, placeName: irnTableResultSummary.irnPlaceNames[0] }
        : newLocation,
    )
  }

  const onLocationPress = (mapLocation: MapLocation) => {
    switch (mapLocation.locationType) {
      case "District":
        checkOnlyOneResult({ ...refineLocation, districtId: mapLocation.id, countyId: undefined, placeName: undefined })
        break
      case "County":
        checkOnlyOneResult({ ...refineLocation, countyId: mapLocation.id, placeName: undefined })
        break
      case "Place":
        onLocationChange({ ...refineLocation, placeName: mapLocation.name })
        break
    }
  }

  const render = () => {
    const irnTablesFiltered = irnTables.filter(byRefineFilter(refineLocation))
    const irnTableResultSummary = getIrnTableResultSummary(irnTablesFiltered)
    const districts = irnTableResultSummary.districtIds
      .map(referenceDataProxy.getDistrict)
      .filter(d => !!d) as Districts
    const counties = irnTableResultSummary.countyIds.map(referenceDataProxy.getCounty).filter(d => !!d) as Counties
    const irnPlaces = irnTableResultSummary.irnPlaceNames.map(irnPlacesProxy.getIrnPlace).filter(d => !!d) as IrnPlaces

    const { districtLocations, countyLocations, irnPlacesLocations } = getAllMapLocations(
      districts,
      counties,
      irnPlaces,
      refineLocation,
    )
    const mapLocations =
      districtLocations.length !== 1
        ? districtLocations
        : countyLocations.length !== 1
        ? countyLocations
        : irnPlacesLocations

    return <LocationsMap mapLocations={mapLocations} onLocationPress={onLocationPress} />
  }

  return render()
}
