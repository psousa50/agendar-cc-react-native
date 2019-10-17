import React from "react"
import "react-native"

// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer"
import { AppContainer } from "../src/App"

it.skip("renders correctly", () => {
  const props = {} as any
  renderer.create(<AppContainer {...props} />)
})
