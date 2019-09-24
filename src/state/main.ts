import { GlobalStateAction } from "./actions"
import { GlobalState, IrnTablesDataState, StaticDataState } from "./models"

type StaticDataReducer = (state: StaticDataState, action: GlobalStateAction) => StaticDataState
const staticDataReducer: StaticDataReducer = (state, action) => {
  switch (action.type) {
    case "STATIC_DATA_FETCH_INIT": {
      return {
        ...state,
        error: null,
        loading: true,
      }
    }
    case "STATIC_DATA_FETCH_SUCCESS": {
      return {
        ...state,
        ...action.payload,
        error: null,
        loaded: true,
        loading: false,
      }
    }
    case "STATIC_DATA_FETCH_FAILURE": {
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      }
    }
    default: {
      return state
    }
  }
}

type IrnTablesDataReducer = (state: IrnTablesDataState, action: GlobalStateAction) => IrnTablesDataState
const irnTablesDataReducer: IrnTablesDataReducer = (state, action) => {
  switch (action.type) {
    case "IRN_TABLES_FETCH_INIT": {
      return {
        ...state,
        error: null,
        loading: true,
      }
    }
    case "IRN_TABLES_FETCH_SUCCESS": {
      return {
        ...state,
        irnTables: action.payload.irnTables,
        irnTablesCache: action.payload.irnTables,
        filterCache: state.filter,
        error: null,
        loading: false,
      }
    }
    case "IRN_TABLES_UPDATE": {
      return {
        ...state,
        irnTables: action.payload.irnTables,
        error: null,
        loading: false,
      }
    }
    case "IRN_TABLES_FETCH_FAILURE": {
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      }
    }
    case "IRN_TABLES_SET_FILTER": {
      return { ...state, filter: { ...state.filter, ...action.payload.filter } }
    }
    case "IRN_TABLES_SET_SELECTED": {
      return { ...state, selectedIrnTable: action.payload.selectedIrnTable }
    }
    default: {
      return state
    }
  }
}

type GlobalStateReducer = (state: GlobalState, action: GlobalStateAction) => GlobalState
export const globalStateReducer: GlobalStateReducer = (state, action) => {
  switch (true) {
    case action.type.startsWith("STATIC_DATA"):
      return {
        ...state,
        staticData: staticDataReducer(state.staticData, action),
      }
    case action.type.startsWith("IRN_TABLES"):
      return {
        ...state,
        irnTablesData: irnTablesDataReducer(state.irnTablesData, action),
      }
    default: {
      return state
    }
  }
}
