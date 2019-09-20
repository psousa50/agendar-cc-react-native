import { mergeIrnTablesByLocation, mergeIrnTablesByTimeSlotAndLocation } from "../../src/irnTables/main"
import { IrnRepositoryTable } from "../../src/irnTables/models"

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

describe("mergeIrnTablesByLocation", () => {
  it("merges tables by location", () => {
    const table1 = makeTable({
      phone: "123",
      locationName: "location name 1",
    })
    const table2 = makeTable({
      phone: "456",
      locationName: "location name 2",
    })
    const table3 = makeTable({
      phone: "789",
      locationName: "location name 1",
    })

    const expectedResult = {
      "location name 1": [table1, table3],
      "location name 2": [table2],
    }

    expect(mergeIrnTablesByLocation([table1, table2, table3])).toEqual(expectedResult)
  })
})

describe("mergeIrnTablesByTimeSlotAndLocation", () => {
  it("return empty object when there is no table", () => {
    expect(mergeIrnTablesByTimeSlotAndLocation([])).toEqual({})
  })

  it("merges one table by time slot and then by location", () => {
    const table = makeTable({
      locationName: "location name 1",
      timeSlots: ["09:00", "15:15"],
    })

    const expectedResult = {
      "09:00": {
        "location name 1": [table],
      },
      "15:15": {
        "location name 1": [table],
      },
    }

    expect(mergeIrnTablesByTimeSlotAndLocation([table])).toEqual(expectedResult)
  })

  it("merges two tables by time slot and then by location", () => {
    const table1 = makeTable({
      locationName: "location name 1",
      timeSlots: ["09:00"],
      phone: "123",
    })
    const table2 = makeTable({
      locationName: "location name 1",
      timeSlots: ["09:00"],
      phone: "456",
    })

    const expectedResult = {
      "09:00": {
        "location name 1": [table1, table2],
      },
    }

    expect(mergeIrnTablesByTimeSlotAndLocation([table1, table2])).toEqual(expectedResult)
  })

  it("merges three tables by time slot and then by location", () => {
    const table1 = makeTable({
      locationName: "location name 1",
      timeSlots: ["09:00", "15:15"],
      phone: "table1",
    })
    const table2 = makeTable({
      locationName: "location name 1",
      timeSlots: ["15:00", "15:15"],
      phone: "table2",
    })
    const table3 = makeTable({
      locationName: "location name 2",
      timeSlots: ["10:00", "15:00", "15:15"],
      phone: "table3",
    })

    const expectedResult = {
      "09:00": {
        "location name 1": [table1],
      },
      "15:15": {
        "location name 1": [table1, table2],
        "location name 2": [table3],
      },
      "15:00": {
        "location name 1": [table2],
        "location name 2": [table3],
      },
      "10:00": {
        "location name 2": [table3],
      },
    }

    expect(mergeIrnTablesByTimeSlotAndLocation([table1, table2, table3])).toEqual(expectedResult)
  })
})
