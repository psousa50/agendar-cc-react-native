import { mergeIrnTablesByLocation } from "../../src/irnTables/main"
import { IrnRepositoryTable } from "../../src/irnTables/models"

const makeTable = (irnTable: Partial<IrnRepositoryTable>): IrnRepositoryTable => {
  const defaultTable = {
    address: "Some Address",
    county: {
      countyId: 3,
      districtId: 2,
      name: "Some name",
    },
    date: new Date("2000-01-01"),
    locationName: "Some Location Name",
    phone: "some-phone",
    postalCode: "some-code",
    serviceId: 1,
    tableNumber: "1",
    times: ["12:30"],
  }

  return {
    ...defaultTable,
    ...irnTable,
  }
}

describe("mergeIrnTables", () => {
  it("merges tables with same service, county and date", () => {
    const date1 = new Date("2010-01-01")
    const date2 = new Date("2010-01-10")
    const times1 = ["12:30", "12:45"]
    const times2 = ["15:00", "15:15"]
    const times3 = ["15:00", "20:15"]
    const aTable = makeTable({
      serviceId: 1,
      county: { districtId: 2, countyId: 3, name: "some name" },
      locationName: "location name 1",
      date: date1,
      times: times1,
    })
    const aSimilarTable = {
      ...aTable,
      date: date2,
      times: times2,
    }
    const aDifferentTable = makeTable({
      serviceId: 10,
      county: { districtId: 20, countyId: 40, name: "some other name" },
      locationName: "location name 2",
      date: date1,
      times: times3,
    })

    const similarTablesMerged = {
      serviceId: aTable.serviceId,
      county: aTable.county,
      locationName: aTable.locationName,
      address: aTable.address,
      postalCode: aTable.postalCode,
      phone: aTable.phone,
      schedules: [
        {
          date: date1,
          times: times1,
        },
        {
          date: date2,
          times: times2,
        },
      ],
    }

    const theDifferentTable = {
      serviceId: aDifferentTable.serviceId,
      county: aDifferentTable.county,
      locationName: aDifferentTable.locationName,
      address: aDifferentTable.address,
      postalCode: aDifferentTable.postalCode,
      phone: aDifferentTable.phone,
      schedules: [
        {
          date: date1,
          times: times3,
        },
      ],
    }
    const result = mergeIrnTablesByLocation([aTable, aSimilarTable, aDifferentTable])
    const expected = [similarTablesMerged, theDifferentTable]

    expect(result).toEqual(expected)
  })

  it("ignores duplicate dates on the tables, merging the times", () => {
    const date1 = new Date("2010-01-01")
    const times1 = ["12:30", "12:45"]
    const times2 = ["11:00", "12:45"]
    const aTable = makeTable({
      serviceId: 1,
      county: { districtId: 2, countyId: 3, name: "some name" },
      locationName: "location name 1",
      date: date1,
      times: times1,
    })
    const aSimilarTable = {
      ...aTable,
      date: date1,
      times: times2,
    }

    const uniqueTimes = ["12:30", "12:45", "11:00"]
    const similarTablesMerged = {
      serviceId: aTable.serviceId,
      county: aTable.county,
      locationName: aTable.locationName,
      address: aTable.address,
      postalCode: aTable.postalCode,
      phone: aTable.phone,
      schedules: [
        {
          date: date1,
          times: uniqueTimes,
        },
      ],
    }

    const result = mergeIrnTablesByLocation([aTable, aSimilarTable])
    const expected = [similarTablesMerged]

    expect(result).toEqual(expected)
  })
})
