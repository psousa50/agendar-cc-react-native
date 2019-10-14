import { combineReducers } from "redux-starter-kit"
import { reducer as irnPlacesData } from "./irnPlacesSlice"
import { reducer as irnTablesData } from "./irnTablesSlice"
import { reducer as referenceData } from "./referenceDataSlice"

export type RootState = ReturnType<typeof rootReducer>

export const rootReducer = combineReducers({
  referenceData,
  irnPlacesData,
  irnTablesData,
})
