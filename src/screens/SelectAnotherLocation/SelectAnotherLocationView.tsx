import { isNil } from "ramda"
import React from "react"
import { LocationsMap, MapLocation } from "../../components/common/LocationsMap"
import { getIrnTableResultSummary } from "../../irnTables/main"
import { Counties, Districts, IrnPlaces, IrnRepositoryTables } from "../../irnTables/models"
import { IrnTableRefineFilter, IrnTableRefineFilterLocation, ReferenceData } from "../../state/models"
import { LocationsType } from "../../utils/location"

interface SelectAnotherLocationViewProps {
  location: IrnTableRefineFilterLocation
  irnTables: IrnRepositoryTables
  referenceData: ReferenceData
  onLocationChange: (location: IrnTableRefineFilterLocation, isLast: boolean) => void
}
export const SelectAnotherLocationView: React.FC<SelectAnotherLocationViewProps> = ({
  irnTables,
  location,
  onLocationChange,
  referenceData,
}) => {
  const checkOnlyOneResult = (newLocation: IrnTableRefineFilterLocation) => {
    const { mapLocations, locationType } = getMapLocations(referenceData)(irnTables, { ...location, ...newLocation })
    const isLast = locationType === "Place" && mapLocations.length === 1
    onLocationChange(newLocation, isLast)
  }

  const onLocationPress = (type: LocationsType, mapLocation: MapLocation) => {
    if (type === "District") {
      checkOnlyOneResult({ ...location, districtId: mapLocation.id, countyId: undefined })
    }
    if (type === "County") {
      checkOnlyOneResult({ ...location, countyId: mapLocation.id })
    }
    if (type === "Place") {
      onLocationChange({ ...location, placeName: mapLocation.name }, true)
    }
  }

  const render = () => {
    const { mapLocations, locationType } = getMapLocations(referenceData)(irnTables, location)
    return <LocationsMap mapLocations={mapLocations} locationType={locationType} onLocationPress={onLocationPress} />
  }

  return render()
}

const getMapLocations = (referenceDate: ReferenceData) => (
  irnTables: IrnRepositoryTables,
  filter: IrnTableRefineFilter,
) => {
  const irnTableResultSummary = getIrnTableResultSummary(irnTables)

  const { districtId, countyId, placeName } = filter

  const districts = irnTableResultSummary.districtIds.map(referenceDate.getDistrict).filter(d => !!d) as Districts
  const counties = irnTableResultSummary.countyIds.map(referenceDate.getCounty).filter(d => !!d) as Counties
  const irnPlaces = irnTableResultSummary.irnPlaceNames.map(referenceDate.getIrnPlace).filter(d => !!d) as IrnPlaces

  const districtLocations = districts
    .filter(d => isNil(districtId) || d.districtId === districtId)
    .map(d => ({ ...d, id: d.districtId }))

  const countyLocations = counties
    .filter(c => (isNil(districtId) || c.districtId === districtId) && (isNil(countyId) || c.countyId === countyId))
    .map(c => ({ ...c, id: c.countyId }))

  const irnPlacesLocations = irnPlaces.filter(
    p =>
      (isNil(districtId) || p.districtId === districtId) &&
      (isNil(countyId) || p.countyId === countyId) &&
      (isNil(placeName) || p.name === placeName),
  )

  const locationType: LocationsType =
    districtLocations.length !== 1 ? "District" : countyLocations.length !== 1 ? "County" : "Place"

  const mapLocations =
    locationType === "District" ? districtLocations : locationType === "County" ? countyLocations : irnPlacesLocations

  return { mapLocations, locationType }
}
