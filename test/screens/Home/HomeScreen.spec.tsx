import React from "react"
import { render } from "react-native-testing-library"
import { HomeScreen } from "../../../src/screens/Home/HomeScreen"
import { AppTest, testStore } from "../../helpers/AppTest"

describe("HomeScreen", () => {
  it("renders", () => {
    const store = testStore()
    const props = {} as any
    render(
      <AppTest store={store}>
        <HomeScreen {...props} />
      </AppTest>,
    )
  })
})
