import { IrnPlace } from "../irnTables/models"
import { IrnTableMatchResult } from "../state/irnTablesSlice"
import { IrnTableApiFilter } from "../state/models"
import { Action } from "../utils/actions"
import { fetchIrnPlaces } from "./irnPlaces"
import { fetchIrnTableMatch } from "./irnTables"
import { fetchReferenceData, FetchReferenceData } from "./referenceData"

export interface IrnApi {
  fetchReferenceData: Action<void, FetchReferenceData>
  fetchIrnPlaces: Action<void, IrnPlace[]>
  fetchIrnTableMatch: Action<IrnTableApiFilter, IrnTableMatchResult>
}

export const irnApi: IrnApi = {
  fetchReferenceData,
  fetchIrnPlaces,
  fetchIrnTableMatch,
}
