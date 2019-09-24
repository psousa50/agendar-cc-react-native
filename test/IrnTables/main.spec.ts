import { mergeIrnTablesByPlace, mergeIrnTablesByTimeSlotAndPlace } from "../../src/irnTables/main"
import { IrnRepositoryTable } from "../../src/irnTables/models"

const makeTable = (irnTable: Partial<IrnRepositoryTable>): IrnRepositoryTable => {
  const defaultTable = {
    address: "Some Address",
    countyId: 20,
    districtId: 30,
    date: new Date("2000-01-01"),
    placeName: "Some Place Name",
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

describe("mergeIrnTablesByPlace", () => {
  it("merges tables by place", () => {
    const table1 = makeTable({
      phone: "123",
      placeName: "place name 1",
    })
    const table2 = makeTable({
      phone: "456",
      placeName: "place name 2",
    })
    const table3 = makeTable({
      phone: "789",
      placeName: "place name 1",
    })

    const expectedResult = {
      "place name 1": [table1, table3],
      "place name 2": [table2],
    }

    expect(mergeIrnTablesByPlace([table1, table2, table3])).toEqual(expectedResult)
  })
})

describe("mergeIrnTablesByTimeSlotAndPlace", () => {
  it("return empty object when there is no table", () => {
    expect(mergeIrnTablesByTimeSlotAndPlace([])).toEqual({})
  })

  it("merges one table by time slot and then by place", () => {
    const table = makeTable({
      placeName: "place name 1",
      timeSlots: ["09:00", "15:15"],
    })

    const expectedResult = {
      "09:00": {
        "place name 1": [table],
      },
      "15:15": {
        "place name 1": [table],
      },
    }

    expect(mergeIrnTablesByTimeSlotAndPlace([table])).toEqual(expectedResult)
  })

  it("merges two tables by time slot and then by place", () => {
    const table1 = makeTable({
      placeName: "place name 1",
      timeSlots: ["09:00"],
      phone: "123",
    })
    const table2 = makeTable({
      placeName: "place name 1",
      timeSlots: ["09:00"],
      phone: "456",
    })

    const expectedResult = {
      "09:00": {
        "place name 1": [table1, table2],
      },
    }

    expect(mergeIrnTablesByTimeSlotAndPlace([table1, table2])).toEqual(expectedResult)
  })

  it("merges three tables by time slot and then by location", () => {
    const table1 = makeTable({
      placeName: "location name 1",
      timeSlots: ["09:00", "15:15"],
      phone: "table1",
    })
    const table2 = makeTable({
      placeName: "location name 1",
      timeSlots: ["15:00", "15:15"],
      phone: "table2",
    })
    const table3 = makeTable({
      placeName: "location name 2",
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

    expect(mergeIrnTablesByTimeSlotAndPlace([table1, table2, table3])).toEqual(expectedResult)
  })
})
