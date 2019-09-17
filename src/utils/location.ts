import { Counties, County, GpsLocation } from "../irnTables/models"

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

type ClosestCounty = { county: County; distance: number }
export const getClosestCounty = (counties: Counties) => (location: GpsLocation) =>
  counties.reduce(
    (acc, county) => {
      if (acc) {
        const newDistance = county.gpsLocation ? calcDistanceInKm(county.gpsLocation, location) : null
        return newDistance && newDistance < acc.distance ? { county, distance: newDistance } : acc
      } else {
        return { county, distance: 100000000 }
      }
    },
    null as ClosestCounty | null,
  )
