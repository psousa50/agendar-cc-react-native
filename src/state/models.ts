import { Counties, Districts } from "../irnTables/models"

export interface GlobalState {
  districts: Districts
  counties: Counties
  countyId: number | undefined
  districtId: number | undefined
}

export const initialGlobalState = {
  districts: [],
  counties: [],
  countyId: undefined,
  districtId: undefined,
}
