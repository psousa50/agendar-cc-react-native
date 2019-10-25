import React from "react"
import { render } from "react-native-testing-library"

import { HomeScreen } from "../../../src/screens/Home/HomeScreen"
import { AppTest } from "../../helpers/AppTest"

describe("HomeScreen", () => {
  it("renders", () => {
    const props = {} as any
    render(
      <AppTest>
        <HomeScreen {...props} />
      </AppTest>,
    )
  })
})
