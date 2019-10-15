import { isNil } from "ramda"
import { MapLocations } from "../components/common/LocationsMap"
import { Counties, County, District, Districts, GpsLocation, IrnPlace, IrnPlaces } from "../irnTables/models"
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

export const getFilteredLocations = (
  districts: Districts,
  counties: Counties,
  irnPlaces: IrnPlaces,
  location: IrnTableFilterLocation,
) => {
  const { districtId, countyId, placeName, region } = location

  const byRegionAndDistrict = (d: District) =>
    (isNil(region) || d.region === region) && (isNil(districtId) || d.districtId === districtId)
  const byDistrictsAndCounty = (ds: Districts) => (c: County) =>
    (ds.map(d => d.districtId).includes(c.districtId) && isNil(countyId)) || c.countyId === countyId
  const byDistrictsAndCounties = (ds: Districts, cs: Counties) => (p: IrnPlace) =>
    ds.map(d => d.districtId).includes(p.districtId) && cs.map(c => c.countyId).includes(p.countyId)
  const byDistrictAndCountyAndPlace = (p: IrnPlace) =>
    (isNil(districtId) || p.districtId === districtId) &&
    (isNil(countyId) || p.countyId === countyId) &&
    (isNil(placeName) || p.name === placeName)

  const filteredDistricts = districts.filter(byRegionAndDistrict)
  const filteredCounties = counties.filter(byDistrictsAndCounty(filteredDistricts))
  const filteredIrnPlaces = irnPlaces
    .filter(byDistrictsAndCounties(filteredDistricts, filteredCounties))
    .filter(byDistrictAndCountyAndPlace)

  return {
    filteredDistricts,
    filteredCounties,
    filteredIrnPlaces,
  }
}

export const getAllMapLocations = (
  districts: Districts,
  counties: Counties,
  irnPlaces: IrnPlaces,
  location: IrnTableFilterLocation,
) => {
  const { filteredDistricts, filteredCounties, filteredIrnPlaces } = getFilteredLocations(
    districts,
    counties,
    irnPlaces,
    location,
  )

  const districtLocations: MapLocations = filteredDistricts.map(d => ({
    ...d,
    id: d.districtId,
    locationType: "District",
  }))
  const countyLocations: MapLocations = filteredCounties.map(c => ({ ...c, id: c.countyId, locationType: "County" }))
  const irnPlacesLocations: MapLocations = filteredIrnPlaces.map(p => ({ ...p, locationType: "Place" }))

  return {
    districtLocations,
    countyLocations,
    irnPlacesLocations,
  }
}

export const normalizeLocation = (referenceDataProxy: ReferenceDataProxy, irnPlacesProxy: IrnPlacesProxy) => (
  location: IrnTableFilterLocation,
) => {
  const { filteredDistricts, filteredCounties, filteredIrnPlaces } = getFilteredLocations(
    referenceDataProxy.getDistricts(),
    referenceDataProxy.getCounties(),
    irnPlacesProxy.getIrnPlaces({}),
    location,
  )

  const singleDistrict = filteredDistricts.length === 1 && filteredDistricts[0]
  const normalizedLocation = {
    region: singleDistrict ? singleDistrict.region : location.region,
    districtId: singleDistrict ? singleDistrict.districtId : location.districtId,
    countyId: filteredCounties.length === 1 ? filteredCounties[0].countyId : location.countyId,
    placeName: filteredIrnPlaces.length === 1 ? filteredIrnPlaces[0].name : location.placeName,
  }

  return normalizedLocation
}
