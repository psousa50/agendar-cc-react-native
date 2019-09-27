import { calcDistanceInKm, getClosestLocation } from "../../src/utils/location"

describe("distanceInKmBetweenEarthCoordinates", () => {
  it("returns zero for equal coords", () => {
    const p1 = { latitude: 1.23, longitude: 4.56 }
    const p2 = { latitude: 1.23, longitude: 4.56 }
    expect(calcDistanceInKm(p1, p2)).toEqual(0)
  })

  it("calcs distance between two coords", () => {
    const p1 = { latitude: 1.2345, longitude: 2.3456 }
    const p2 = { latitude: 3.4567, longitude: 4.5676 }
    expect(calcDistanceInKm(p1, p2)).toBeGreaterThan(349.27)
    expect(calcDistanceInKm(p1, p2)).toBeLessThanOrEqual(349.29)
  })
})

describe("getClosestLocation", () => {
  it("returns the closest location to a gps cords", () => {
    const location1 = { gpsLocation: { latitude: 1.3, longitude: 2.3 } } as any
    const location2 = { gpsLocation: { latitude: 1.1, longitude: 2.1 } } as any
    const location3 = { gpsLocation: { latitude: 1.2, longitude: 2.2 } } as any
    const location = { latitude: 1.0, longitude: 2.0 }

    const result = getClosestLocation([location1, location2, location3])(location)

    const expectedResult = {
      location: location2,
      distance: calcDistanceInKm(location2.gpsLocation, location),
    }

    expect(result).toEqual(expectedResult)
  })
})
