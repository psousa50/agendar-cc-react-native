export interface GlobalState {
  countyId: number | undefined
  districtId: number | undefined
}

export const initialGlobalState = {
  countyId: undefined,
  districtId: undefined,
}
