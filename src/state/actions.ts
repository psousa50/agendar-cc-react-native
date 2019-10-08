import { Counties, Districts, IrnRepositoryTables } from "../irnTables/models"
import { IrnTableFilter, IrnTableRefineFilter, SelectedIrnTableState } from "./models"
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
        filter: IrnTableFilter
      }
    }
  | {
      type: "IRN_TABLES_SET_FILTER_FOR_EDIT"
      payload: {
        filter: IrnTableFilter
      }
    }
  | {
      type: "IRN_TABLES_SET_REFINE_FILTER"
      payload: {
        filter: IrnTableRefineFilter
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
      type: "IRN_TABLES_UPDATE"
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
  | {
      type: "IRN_TABLES_SET_SELECTED"
      payload: {
        selectedIrnTable?: SelectedIrnTableState
      }
    }
