import { calcDistanceInKm, getClosestCounty } from "../../src/utils/location"

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

describe("getClosestCounty", () => {
  it("returns the closest County to a location", () => {
    const county1 = { gpsLocation: { latitude: 1.3, longitude: 2.3 } } as any
    const county2 = { gpsLocation: { latitude: 1.1, longitude: 2.1 } } as any
    const county3 = { gpsLocation: { latitude: 1.2, longitude: 2.2 } } as any
    const location = { latitude: 1.0, longitude: 2.0 }

    const result = getClosestCounty([county1, county2, county3])(location)

    const expectedResult = {
      county: county2,
      distance: calcDistanceInKm(county2.gpsLocation, location),
    }

    expect(result).toEqual(expectedResult)
  })
})
