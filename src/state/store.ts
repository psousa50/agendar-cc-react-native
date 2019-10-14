import { Action, createStore } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import { ThunkAction } from "redux-thunk"
import { rootReducer, RootState } from "./rootReducer"

export const store = createStore(rootReducer, {}, composeWithDevTools())

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>
