import React from "react"
import { useGlobalState } from "../../GlobalStateProvider"
import { globalStateSelectors } from "../../state/selectors"
import { AppModalScreen, AppScreenProps } from "../common/AppScreen"
import { SelectAnotherDateView } from "../views/SelectAnotherDateView"
import { navigate } from "./screens"

export const SelectAnotherDateScreen: React.FC<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState, globalDispatch] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)

  const onDateSelected = (date: Date) => {
    globalDispatch({
      type: "IRN_TABLES_SET_REFINE_FILTER",
      payload: { filter: { date } },
    })
    navigation.goBack()
  }

  const selectAnotherDateViewProps = {
    irnTables: stateSelectors.getIrnTables,
    onDateSelected,
  }
  return (
    <AppModalScreen {...props}>
      <SelectAnotherDateView {...selectAnotherDateViewProps} />
    </AppModalScreen>
  )
}
