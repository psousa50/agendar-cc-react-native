import { isNil, uniq } from "ramda"
import React from "react"
import { LocationsMap, MapLocation } from "../../components/common/LocationsMap"
import { Counties, Districts, IrnPlace, IrnPlaces } from "../../irnTables/models"
import { IrnPlacesProxy } from "../../state/irnPlacesSlice"
import { IrnTableRefineFilter, IrnTableRefineFilterLocation } from "../../state/models"
import { ReferenceDataProxy } from "../../state/referenceDataSlice"
import { getAllMapLocations } from "../../utils/location"

interface SelectAnotherLocationViewProps {
  irnPlacesProxy: IrnPlacesProxy
  places: string[]
  referenceDataProxy: ReferenceDataProxy
  refineLocation: IrnTableRefineFilterLocation
  onLocationChange: (location: IrnTableRefineFilterLocation) => void
}

export const SelectAnotherLocationView: React.FC<SelectAnotherLocationViewProps> = ({
  places,
  refineLocation,
  irnPlacesProxy,
  onLocationChange,
  referenceDataProxy,
}) => {
  const irnPlaces = places.map(irnPlacesProxy.getIrnPlace).filter(p => !!p) as IrnPlaces
  const districts = uniq(irnPlaces.map(p => p.districtId))
    .map(referenceDataProxy.getDistrict)
    .filter(d => !!d) as Districts
  const counties = uniq(irnPlaces.map(p => p.countyId))
    .map(referenceDataProxy.getCounty)
    .filter(d => !!d) as Counties

  const checkOnlyOneResult = (newLocation: IrnTableRefineFilterLocation) => {
    const irnPlacesFiltered = irnPlaces.filter(byIrnTableRefineFilter({ ...refineLocation, ...newLocation }))

    onLocationChange(
      irnPlacesFiltered.length === 1 ? { ...newLocation, placeName: irnPlacesFiltered[0].name } : newLocation,
    )
  }

  const onLocationPress = (mapLocation: MapLocation) => {
    switch (mapLocation.locationType) {
      case "District":
        checkOnlyOneResult({
          ...refineLocation,
          districtId: mapLocation.id,
          countyId: undefined,
          placeName: undefined,
        })
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
    const { countyId, districtId, placeName } = refineLocation
    const location = {
      countyId,
      districtId,
      placeName,
    }
    const { districtLocations, countyLocations, irnPlacesLocations } = getAllMapLocations(
      districts,
      counties,
      irnPlaces,
      location,
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

const byIrnTableRefineFilter = ({ countyId, districtId, placeName }: IrnTableRefineFilter) => (irnPlace: IrnPlace) => {
  return (
    (isNil(districtId) || irnPlace.districtId === districtId) &&
    (isNil(countyId) || irnPlace.countyId === countyId) &&
    (isNil(placeName) || irnPlace.name === placeName)
  )
}
