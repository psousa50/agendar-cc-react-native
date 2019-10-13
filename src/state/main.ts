import { GlobalStateAction } from "./actions"
import { GlobalState, IrnTableFilter, IrnTablesDataState, StaticDataState } from "./models"

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

export const normalizeFilter = (filter: IrnTableFilter) => {
  const { startDate, endDate, startTime, endTime } = filter
  const swapDates = startDate && endDate ? startDate > endDate : false
  const swapTimes = startTime && endTime ? startTime > endTime : false
  return {
    ...filter,
    startDate: swapDates ? endDate : startDate,
    endDate: swapDates ? startDate : endDate,
    startTime: swapTimes ? endTime : startTime,
    endTime: swapTimes ? startTime : endTime,
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
      const { irnTables } = action.payload
      return {
        ...state,
        irnTables,
        irnTablesCache: irnTables,
        filterCache: state.filter,
        error: null,
        loading: false,
      }
    }
    case "IRN_TABLES_UPDATE": {
      const { filter, irnTables } = action.payload
      return {
        ...state,
        irnTables,
        filter,
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
    case "IRN_TABLES_UPDATE_FILTER": {
      const newFilter = action.payload.filter
      return { ...state, filter: normalizeFilter({ ...state.filter, ...newFilter }), filterForEdit: newFilter }
    }
    case "IRN_TABLES_SET_FILTER_FOR_EDIT": {
      const newFilter = normalizeFilter(action.payload.filter)
      return { ...state, filterForEdit: newFilter }
    }
    case "IRN_TABLES_SET_REFINE_FILTER": {
      const newFilter = normalizeFilter(action.payload.filter)
      return { ...state, refineFilter: newFilter }
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
