import { render, wait } from "@testing-library/react-native"
import React from "react"
import { DeepPartial } from "redux"
import { IrnTablesResultsScreen } from "../../../src/screens/IrnTableResults/IrnTablesResultsScreen"
import { IrnTableFilter, IrnTableRefineFilter } from "../../../src/state/models"
import { RootState } from "../../../src/state/rootReducer"
import { toDateString } from "../../../src/utils/dates"
import { defaultEnv } from "../../helpers/defaults"
import { withEnvAndStore } from "../../helpers/wrappers"

describe("IrnTablesResultsScreen", () => {
  it("calls api for results", async () => {
    const filter: IrnTableFilter = {
      serviceId: 1,
      countyId: 2,
      distanceRadiusKm: 100,
      districtId: 3,
      gpsLocation: { latitude: 10, longitude: 20 },
      placeName: "Some Place Name",
      region: "Acores",
      date: toDateString("2010-09-20"),
      endDate: toDateString("2010-09-30"),
      endTime: "19:10",
      onlyOnSaturdays: true,
      startDate: toDateString("2010-09-02"),
      startTime: "08:20",
      timeSlot: "15:35",
    }
    const refineFilter: IrnTableRefineFilter = {
      date: toDateString("2010-09-10"),
      timeSlot: "14:00",
      countyId: 10,
      districtId: 20,
      placeName: "Other Place Name",
      region: "Madeira",
    }

    const state: DeepPartial<RootState> = {
      irnTablesData: {
        filter,
        refineFilter,
        irnTableMatchResult: {
          otherDates: [],
          otherPlaces: [],
          otherTimeSlots: [],
        },
      },
    }

    const Wrapped = withEnvAndStore(defaultEnv, state)(IrnTablesResultsScreen)

    render(<Wrapped navigation={{} as any} />)

    const params = {
      ...filter,
      selected: {
        ...refineFilter,
      },
    }
    await wait(() => expect(defaultEnv.irnApi.fetchIrnTableMatch).toHaveBeenCalledWith(params))
  })
})
