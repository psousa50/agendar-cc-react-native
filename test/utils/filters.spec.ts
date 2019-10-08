import { IrnTableFilter, Region } from "../../src/state/models"
import { equalCompatible, filtersAreCompatible, rangeCompatible } from "../../src/utils/filters"

describe("equalCompatible", () => {
  it("is true on equal elements", () => {
    const filter1 = { v1: 1 } as any
    const filter2 = { v1: 1 } as any

    expect(equalCompatible(filter1, filter2)("v1" as any)).toBeTruthy()
  })

  it("is true if first element is not defined", () => {
    const filter1 = { v1: undefined } as any
    const filter2 = { v1: 1 } as any

    expect(equalCompatible(filter1, filter2)("v1" as any)).toBeTruthy()
  })

  it("is false otherwise", () => {
    const filter1 = { v1: 1 } as any
    const filter2 = { v1: undefined } as any

    expect(equalCompatible(filter1, filter2)("v1" as any)).toBeFalsy()
  })
})

describe("rangeCompatible", () => {
  it("is true if first range include second range", () => {
    const filter1 = { start: 1, end: 5 } as any
    const filter2 = { start: 2, end: 4 } as any

    expect(rangeCompatible(filter1, filter2)("start" as any, "end" as any)).toBeTruthy()
  })

  it("is true if first range equals second range", () => {
    const filter1 = { start: 1, end: 5 } as any
    const filter2 = { start: 1, end: 5 } as any

    expect(rangeCompatible(filter1, filter2)("start" as any, "end" as any)).toBeTruthy()
  })

  it("is true if first range is open on left", () => {
    const filter1 = { start: undefined, end: 5 } as any
    const filter2 = { start: 1, end: 5 } as any

    expect(rangeCompatible(filter1, filter2)("start" as any, "end" as any)).toBeTruthy()
  })

  it("is true if first range is open on right", () => {
    const filter1 = { start: undefined, end: 5 } as any
    const filter2 = { start: 1, end: 5 } as any

    expect(rangeCompatible(filter1, filter2)("start" as any, "end" as any)).toBeTruthy()
  })

  it("is false if second range is open on left and first isn't", () => {
    const filter1 = { start: 1, end: 5 } as any
    const filter2 = { start: undefined, end: 5 } as any

    expect(rangeCompatible(filter1, filter2)("start" as any, "end" as any)).toBeFalsy()
  })

  it("is false if second range is open on right and first isn't", () => {
    const filter1 = { start: 1, end: 5 } as any
    const filter2 = { start: 1, end: undefined } as any

    expect(rangeCompatible(filter1, filter2)("start" as any, "end" as any)).toBeFalsy()
  })
})

describe("filtersAreCompatible", () => {
  const defaultFilter: IrnTableFilter = {
    countyId: 1,
    distanceRadiusKm: 20,
    districtId: 4,
    endDate: new Date("2000-01-31"),
    endTime: "10:00",
    gpsLocation: {
      latitude: 1.3,
      longitude: 5.78,
    },
    onlyOnSaturdays: true,
    placeName: "some place",
    region: "Continente",
    startDate: new Date("2000-01-01"),
    startTime: "20:00",
  }

  describe("returns true", () => {
    it("if they are equal", () => {
      const filter = defaultFilter

      expect(filtersAreCompatible(filter, filter)).toBeTruthy()
    })

    it("if second distance in Km is less than first one", () => {
      const filter1 = { ...defaultFilter, distanceRadiusKm: 20 }
      const filter2 = { ...defaultFilter, distanceRadiusKm: 15 }

      expect(filtersAreCompatible(filter1, filter2)).toBeTruthy()
    })

    it("if the second date range is included on the first one", () => {
      const filter1 = { ...defaultFilter, startDate: new Date("2000-01-01"), endDate: new Date("2000-01-31") }
      const filter2 = { ...defaultFilter, startDate: new Date("2000-01-02"), endDate: new Date("2000-01-30") }

      expect(filtersAreCompatible(filter1, filter2)).toBeTruthy()
    })

    it("if the second time slot range is included on the first one", () => {
      const filter1 = { ...defaultFilter, startTime: "10:00", endTime: "20:00" }
      const filter2 = { ...defaultFilter, startTime: "11:00", endTime: "19:00" }

      expect(filtersAreCompatible(filter1, filter2)).toBeTruthy()
    })

    it("if onlyOnSaturdays arelogical equal", () => {
      const filter1 = { ...defaultFilter, onlyOnSaturdays: undefined }
      const filter2 = { ...defaultFilter, onlyOnSaturdays: false }

      expect(filtersAreCompatible(filter1, filter2)).toBeTruthy()
    })
  })

  describe("returns false", () => {
    it("if countyId is different", () => {
      const filter1 = { ...defaultFilter, countyId: 10 }
      const filter2 = { ...defaultFilter, countyId: 15 }

      expect(filtersAreCompatible(filter1, filter2)).toBeFalsy()
    })

    it("if districtId is different", () => {
      const filter1 = { ...defaultFilter, districtId: 10 }
      const filter2 = { ...defaultFilter, districtId: 15 }

      expect(filtersAreCompatible(filter1, filter2)).toBeFalsy()
    })

    it("if placeName is different", () => {
      const filter1 = { ...defaultFilter, placeName: "some place name" }
      const filter2 = { ...defaultFilter, placeName: "other place name" }

      expect(filtersAreCompatible(filter1, filter2)).toBeFalsy()
    })

    it("if onlyOnSaturdays are not logical equal", () => {
      const filter1 = { ...defaultFilter, onlyOnSaturdays: undefined }
      const filter2 = { ...defaultFilter, onlyOnSaturdays: true }

      expect(filtersAreCompatible(filter1, filter2)).toBeFalsy()
    })

    it("if region is different", () => {
      const filter1 = { ...defaultFilter, region: "Continente" as Region }
      const filter2 = { ...defaultFilter, region: "Madeira" as Region }

      expect(filtersAreCompatible(filter1, filter2)).toBeFalsy()
    })

    it("if gpsLocation is different", () => {
      const filter1 = { ...defaultFilter, gpsLocation: { latitude: 1.234, longitude: 3.456 } }
      const filter2 = { ...defaultFilter, gpsLocation: { latitude: 1.2345, longitude: 3.4566 } }

      expect(filtersAreCompatible(filter1, filter2)).toBeFalsy()
    })

    it("if the second date range is NOT included on the first one", () => {
      const filter1 = { ...defaultFilter, startDate: new Date("2000-01-10"), endDate: new Date("2000-01-31") }
      const filter2 = { ...defaultFilter, startDate: new Date("2000-01-02"), endDate: new Date("2000-01-30") }

      expect(filtersAreCompatible(filter1, filter2)).toBeFalsy()
    })

    it("if the second time slot range is NOT included on the first one", () => {
      const filter1 = { ...defaultFilter, startTime: "15:00", endTime: "20:00" }
      const filter2 = { ...defaultFilter, startTime: "11:00", endTime: "19:00" }

      expect(filtersAreCompatible(filter1, filter2)).toBeFalsy()
    })
  })
})
