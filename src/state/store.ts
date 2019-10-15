import { Action } from "redux"
import { configureStore } from "redux-starter-kit"
import { ThunkAction } from "redux-thunk"
import { rootReducer, RootState } from "./rootReducer"

export const store = configureStore({ reducer: rootReducer })
export type Store = typeof store

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>
