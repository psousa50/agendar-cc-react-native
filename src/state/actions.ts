import { Counties, Districts, IrnRepositoryTables } from "../irnTables/models"
import { IrnFilterState } from "./models"
export type GlobalStateAction =
  | {
      type: "STATIC_DATA_FETCH_INIT"
    }
  | {
      type: "STATIC_DATA_FETCH_SUCCESS"
      payload: {
        districts: Districts
        counties: Counties
      }
    }
  | {
      type: "STATIC_DATA_FETCH_FAILURE"
      payload: {
        error: Error
      }
    }
  | {
      type: "IRN_TABLES_SET_FILTER"
      payload: {
        filter: IrnFilterState
      }
    }
  | {
      type: "IRN_TABLES_FETCH_INIT"
    }
  | {
      type: "IRN_TABLES_FETCH_SUCCESS"
      payload: {
        irnTables: IrnRepositoryTables
      }
    }
  | {
      type: "IRN_TABLES_FETCH_FAILURE"
      payload: {
        error: Error
      }
    }
