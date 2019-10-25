import { Radio } from "native-base"
import React from "react"
import { fireEvent, render } from "react-native-testing-library"
import { RadioButton } from "../../src/components/common/RadioButton"

describe("RadioButton", () => {
  it("should render the label", () => {
    const label = "Some Label"
    const selected = true
    const props = {
      label,
      selected,
    } as any
    const { queryByText, queryByType } = render(<RadioButton {...props} />)

    expect(queryByText("label")).toBeDefined()
    expect(queryByType(Radio)!.props.selected).toBe(selected)
  })

  it("calls onSelected when pressed", () => {
    const onSelected = jest.fn()
    const id = "some id"
    const props = {
      onSelected,
      id,
    } as any
    const { getByType } = render(<RadioButton {...props} />)
    fireEvent(getByType(Radio), "onPress")

    expect(onSelected).toHaveBeenCalledWith(id)
  })
})
