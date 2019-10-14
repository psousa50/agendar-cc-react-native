import { isNil } from "ramda"
import { GpsLocation } from "../irnTables/models"
import { IrnPlacesProxy } from "../state/irnPlacesSlice"
import { IrnTableFilterLocation } from "../state/models"
import { ReferenceDataProxy } from "../state/referenceDataSlice"

const degreesToRadians = (degrees: number) => {
  return (degrees * Math.PI) / 180
}

export const calcDistanceInKm = (loc1: GpsLocation, loc2: GpsLocation) => {
  const earthRadiusKm = 6371

  const dLat = degreesToRadians(loc2.latitude - loc1.latitude)
  const dLon = degreesToRadians(loc2.longitude - loc1.longitude)

  const lat1 = degreesToRadians(loc1.latitude)
  const lat2 = degreesToRadians(loc2.latitude)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return earthRadiusKm * c
}

export const getClosestLocation = <T extends { gpsLocation?: GpsLocation }>(locations: T[]) => (
  locationToMatch: GpsLocation,
) =>
  locations.length > 0
    ? locations.slice(1).reduce(
        (acc, location) => {
          const newDistance = location.gpsLocation ? calcDistanceInKm(location.gpsLocation, locationToMatch) : null
          return newDistance && newDistance < acc.distance ? { location, distance: newDistance } : acc
        },
        { location: locations[0], distance: calcDistanceInKm(locations[0].gpsLocation!, locationToMatch) },
      )
    : undefined

export type LocationsType = "District" | "County" | "Place"

export const getMapLocations = (referenceDataProxy: ReferenceDataProxy, irnPlacesProxy: IrnPlacesProxy) => (
  location: IrnTableFilterLocation,
) => {
  const { districtId, countyId, placeName, region } = location
  const districtLocations = referenceDataProxy
    .getDistricts(region)
    .filter(d => isNil(districtId) || d.districtId === districtId)
    .map(d => ({ ...d, id: d.districtId }))

  const countyLocations = referenceDataProxy
    .getCounties(districtId)
    .filter(c => districtLocations.map(d => d.districtId).includes(c.districtId))
    .filter(c => isNil(countyId) || c.countyId === countyId)
    .map(c => ({ ...c, id: c.countyId }))

  const irnPlacesLocations = irnPlacesProxy
    .getIrnPlaces({})
    .filter(p => districtLocations.map(d => d.districtId).includes(p.districtId))
    .filter(p => countyLocations.map(d => d.countyId).includes(p.countyId))
    .filter(
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

export const normalizeLocation = (referenceDataProxy: ReferenceDataProxy, irnPlacesProxy: IrnPlacesProxy) => ({
  districtId,
  countyId,
  region,
  placeName: initialPlaceName,
}: IrnTableFilterLocation) => {
  const getSinglePlaceName = () => {
    const irnPlaces = irnPlacesProxy.getIrnPlaces({ districtId, countyId })
    return irnPlaces.length === 1 ? irnPlaces[0].name : undefined
  }

  const placeName = initialPlaceName || getSinglePlaceName()
  const district = referenceDataProxy.getDistrict(districtId)
  return {
    region: region || (district && district.region),
    countyId,
    districtId,
    placeName,
  }
}
