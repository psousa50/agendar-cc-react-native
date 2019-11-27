import AsyncStorage from "@react-native-community/async-storage"
import { configureStore } from "@reduxjs/toolkit"
import { Action } from "redux"
import { persistReducer, persistStore } from "redux-persist"
import thunk from "redux-thunk"
import { ThunkAction } from "redux-thunk"
import { rootReducer, RootState } from "./rootReducer"

export type AgendarCCStore = typeof store
export type AgendarCCReducer = typeof rootReducer
export type AgendarCCState = ReturnType<AgendarCCReducer>

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({ reducer: persistedReducer, middleware: [thunk] })
export const storePersistor = persistStore(store)
