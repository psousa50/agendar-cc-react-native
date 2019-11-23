import { DeepPartial } from "redux"
import { Environment } from "../../src/environment/main"
import { RootState } from "../../src/state/rootReducer"
import { actionOf } from "../../src/utils/actions"

export const defaultIrnApi = {
  fetchIrnPlaces: jest.fn(),
  fetchReferenceData: jest.fn(),
  fetchIrnTableMatch: jest.fn(() => actionOf({ otherDates: [], otherPlaces: [], otherTimeSlots: [] })),
} as any
export const defaultEnv: Environment = {
  irnApi: defaultIrnApi,
}

export const defaultState: DeepPartial<RootState> = {
  userData: {
    disclaimerShown: true,
  },
}
