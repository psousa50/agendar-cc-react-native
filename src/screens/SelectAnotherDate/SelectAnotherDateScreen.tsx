import React from "react"
import { AppModalScreen, AppScreenProps } from "../../components/common/AppScreen"
import { useGlobalState } from "../../GlobalStateProvider"
import { globalStateSelectors } from "../../state/selectors"
import { navigate } from "../screens"
import { SelectAnotherDateView } from "./SelectAnotherDateView"

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
