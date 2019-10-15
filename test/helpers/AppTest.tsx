import React from "react"
import { configureStore } from "redux-starter-kit"
import { AppContainer } from "../../src/App"
import { rootReducer } from "../../src/state/rootReducer"

const store = configureStore({ reducer: rootReducer })

const props = {
  store,
}
export const AppTest: React.FC = ({ children }) => <AppContainer {...props}>{children}</AppContainer>
