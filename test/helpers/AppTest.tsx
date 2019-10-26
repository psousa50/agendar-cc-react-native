import React from "react"
import { Provider } from "react-redux"
import { configureStore } from "redux-starter-kit"
import thunk from "redux-thunk"
import { rootReducer } from "../../src/state/rootReducer"

export const testStore = () => configureStore({ reducer: rootReducer, middleware: [thunk] })
type TestStore = ReturnType<typeof testStore>

interface AppTestProps {
  store: TestStore
}

export const AppTest: React.FC<AppTestProps> = ({ children, store }) => <Provider store={store}>{children}</Provider>
