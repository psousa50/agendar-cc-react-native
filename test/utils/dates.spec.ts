import {
  calcDiffDays,
  createDateStringRange,
  toExistingDateString,
} from "../../src/utils/dates"

describe("calcDiffDays", () => {
  it("calcs dates diff in days, ignoring time", () => {
    const d1 = new Date("2010-01-01T10:20:30")
    const d2 = new Date("2010-01-05T05:24:56")
    expect(calcDiffDays(d1, d2)).toEqual(4)
  })
})

describe("calcDiffDays", () => {
  it("calcs dates diff in days, ignoring time", () => {
    const d1 = toExistingDateString("2010-01-01")
    const d2 = toExistingDateString("2010-01-05")

    const dr1 = toExistingDateString("2010-01-01")
    const dr2 = toExistingDateString("2010-01-02")
    const dr3 = toExistingDateString("2010-01-03")
    const dr4 = toExistingDateString("2010-01-04")
    const dr5 = toExistingDateString("2010-01-05")
    expect(createDateStringRange(d1, d2)).toEqual([dr1, dr2, dr3, dr4, dr5])
  })
})
