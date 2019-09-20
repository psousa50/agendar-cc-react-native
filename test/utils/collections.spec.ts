import { groupCollection } from "../../src/utils//collections"

describe("groupCollection", () => {
  it("group a collection by some key", () => {
    const col = [
      {
        value: 10,
        data: 101,
      },
      {
        value: 20,
        data: 202,
      },
      {
        value: 10,
        data: 102,
      },
    ]

    const expectedResult = [
      {
        key: 10,
        group: [col[0], col[2]],
      },
      {
        key: 20,
        group: [col[1]],
      },
    ]

    const keyExtrator = (v: any) => v.value

    const result = groupCollection(keyExtrator, col)

    expect(result).toEqual(expectedResult)
  })
})
