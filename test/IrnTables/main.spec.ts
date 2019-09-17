import { mergeIrnTablesByLocation } from "../../src/irnTables/main"
import { IrnRepositoryTable, IrnTableDateSchedules, IrnTableLocationSchedules } from "../../src/irnTables/models"

const makeTable = (irnTable: Partial<IrnRepositoryTable>): IrnRepositoryTable => {
  const defaultTable = {
    address: "Some Address",
    countyId: 20,
    districtId: 30,
    date: new Date("2000-01-01"),
    locationName: "Some Location Name",
    phone: "some-phone",
    postalCode: "some-code",
    serviceId: 10,
    tableNumber: "1",
    timeSlots: ["12:30"],
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
    const timeSlots1 = ["12:30", "12:45"]
    const timeSlots2 = ["15:00", "15:15"]
    const timeSlots3 = ["15:00", "20:15"]
    const aTable = makeTable({
      serviceId: 1,
      districtId: 2,
      countyId: 3,
      locationName: "location name 1",
      date: date1,
      timeSlots: timeSlots1,
    })
    const aSimilarTable = {
      ...aTable,
      date: date2,
      timeSlots: timeSlots2,
    }
    const aDifferentTable = makeTable({
      serviceId: 10,
      districtId: 20,
      countyId: 40,
      locationName: "location name 2",
      date: date1,
      timeSlots: timeSlots3,
    })

    const similarTablesMerged: IrnTableLocationSchedules = {
      serviceId: aTable.serviceId,
      countyId: aTable.countyId,
      districtId: aTable.districtId,
      locationName: aTable.locationName,
      address: aTable.address,
      postalCode: aTable.postalCode,
      phone: aTable.phone,
      daySchedules: [
        {
          date: date1,
          timeSlots: timeSlots1,
        },
        {
          date: date2,
          timeSlots: timeSlots2,
        },
      ],
    }

    const aDifferentTableMerged = {
      serviceId: aDifferentTable.serviceId,
      countyId: aDifferentTable.countyId,
      districtId: aDifferentTable.districtId,
      locationName: aDifferentTable.locationName,
      address: aDifferentTable.address,
      postalCode: aDifferentTable.postalCode,
      phone: aDifferentTable.phone,
      daySchedules: [
        {
          date: date1,
          timeSlots: timeSlots3,
        },
      ],
    }
    const result = mergeIrnTablesByLocation([aTable, aSimilarTable, aDifferentTable])
    const expected = [similarTablesMerged, aDifferentTableMerged]

    expect(result).toEqual(expected)
  })

  it("ignores duplicate dates on the tables, merging the times", () => {
    const date1 = new Date("2010-01-01")
    const timeSlots1 = ["12:30", "12:45"]
    const timeSlots2 = ["11:00", "12:45"]
    const aTable = makeTable({
      serviceId: 1,
      districtId: 2,
      countyId: 3,
      locationName: "location name 1",
      date: date1,
      timeSlots: timeSlots1,
    })
    const aSimilarTable = {
      ...aTable,
      date: date1,
      timeSlots: timeSlots2,
    }

    const uniqueTimes = ["12:30", "12:45", "11:00"]
    const similarTablesMerged: IrnTableLocationSchedules = {
      serviceId: aTable.serviceId,
      countyId: aTable.countyId,
      districtId: aTable.districtId,
      locationName: aTable.locationName,
      address: aTable.address,
      postalCode: aTable.postalCode,
      phone: aTable.phone,
      daySchedules: [
        {
          date: date1,
          timeSlots: uniqueTimes,
        },
      ],
    }

    const result = mergeIrnTablesByLocation([aTable, aSimilarTable])
    const expected = [similarTablesMerged]

    expect(result).toEqual(expected)
  })
})
